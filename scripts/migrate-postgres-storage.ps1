param(
    [switch]$SkipBackup
)

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
    if (-not $SkipBackup) {
        Write-Host 'Creating a logical backup from the currently running database...'
        Invoke-CheckedDocker -DockerArguments @('compose', 'run', '--rm', '--no-deps', 'backup', 'sh', '/scripts/backup.sh', 'once', 'manual')
    }

    Write-Host 'Stopping the application so PostgreSQL data can be copied consistently...'
    Invoke-CheckedDocker -DockerArguments @('compose', 'down', '--timeout', '60')

    Write-Host 'Copying legacy PostgreSQL data into the Docker named volume...'
    Invoke-CheckedDocker -DockerArguments @('compose', 'run', '--rm', '-e', 'ALLOW_CRASH_RECOVERY_COPY=1', 'postgres-data-init')

    Write-Host 'Enabling page checksums when the copied cluster is ready...'
    Invoke-CheckedDocker -DockerArguments @('compose', 'run', '--rm', '-e', 'ENABLE_CHECKSUMS_ONLY=1', 'postgres-data-init')

    Write-Host 'Starting the application with named-volume PostgreSQL storage...'
    Invoke-CheckedDocker -DockerArguments @('compose', 'up', '-d', '--build')

    Write-Host 'Checking the migrated database...'
    & (Join-Path $PSScriptRoot 'check-database.ps1')
    if ($LASTEXITCODE -ne 0) {
        throw "Database verification failed with exit code $LASTEXITCODE."
    }

    Write-Host 'PostgreSQL storage migration completed successfully.'
}
finally {
    Pop-Location
}
