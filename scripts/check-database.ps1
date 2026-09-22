$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path

function Invoke-CheckedDocker {
    param([string[]]$DockerArguments)
    & docker @DockerArguments
    if ($LASTEXITCODE -ne 0) {
        throw "docker $($DockerArguments -join ' ') failed with exit code $LASTEXITCODE."
    }
}

Push-Location $projectRoot
try {
    Write-Host 'Container status:'
    Invoke-CheckedDocker -DockerArguments @('compose', 'ps')

    Write-Host "`nPostgreSQL status and statistics:"
    $diagnosticSql = @'
SELECT version();
SELECT current_setting('data_checksums') AS data_checksums,
       pg_size_pretty(pg_database_size(current_database())) AS database_size;
SELECT count(*) FILTER (WHERE NOT indisvalid) AS invalid_indexes,
       count(*) AS total_indexes
FROM pg_index;
SELECT relname, n_live_tup, n_dead_tup, last_autovacuum, last_autoanalyze
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC, relname;
'@
    $diagnosticSql | & docker compose exec -T postgres sh -ec 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 -P pager=off'
    if ($LASTEXITCODE -ne 0) {
        throw "PostgreSQL diagnostic query failed with exit code $LASTEXITCODE."
    }

    Write-Host "`nChecking table and B-tree index integrity:"
    Invoke-CheckedDocker -DockerArguments @('compose', 'exec', '-T', 'postgres', 'sh', '-ec', 'pg_amcheck --database="$POSTGRES_DB" --install-missing -U "$POSTGRES_USER"')

    $latestBackup = Get-ChildItem (Join-Path $projectRoot 'data\backups') -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -notlike '.*.part' -and (Test-Path (Join-Path $_.FullName 'database.dump')) } |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1

    if ($latestBackup) {
        Write-Host "`nValidating latest backup: $($latestBackup.Name)"
        $mount = "type=bind,source=$($latestBackup.FullName),target=/backup,readonly"
        Invoke-CheckedDocker -DockerArguments @('run', '--rm', '--mount', $mount, 'postgres:16-alpine', 'sh', '-ec', 'cd /backup && sha256sum -c SHA256SUMS && pg_restore --list database.dump >/dev/null')
    }
    else {
        throw 'No completed database backup was found.'
    }

    Write-Host "`nDatabase and latest backup checks passed."
}
finally {
    Pop-Location
}
