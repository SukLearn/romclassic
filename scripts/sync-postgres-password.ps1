# Re-applies POSTGRES_PASSWORD from .env to the existing PostgreSQL role.
#
# PostgreSQL keeps the role password inside the data volume and reads
# POSTGRES_PASSWORD only when it initializes an empty volume. When .env is
# recreated or edited afterwards, or the volume is filled from a cluster that
# was created with another .env (data\postgres, a restore, another computer),
# the backend and backup services fail with
#   password authentication failed for user "inventory"   (SQLSTATE 28P01)
# while the postgres healthcheck still passes, because it uses the local socket.
#
# The ALTER ROLE statement runs over the container's local socket, which the
# official image trusts, so the old password is not needed. No table data is
# changed. Usage:
#   powershell -ExecutionPolicy Bypass -File .\scripts\sync-postgres-password.ps1
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
    Write-Host 'Starting PostgreSQL with the current .env values...'
    Invoke-CheckedDocker -DockerArguments @('compose', 'up', '-d', '--wait', 'postgres')

    Write-Host 'Applying POSTGRES_PASSWORD from .env to the database role...'
    $syncSql = @'
\getenv role POSTGRES_USER
\getenv password POSTGRES_PASSWORD
ALTER ROLE :"role" WITH PASSWORD :'password';
'@
    $syncSql | & docker compose exec -T postgres sh -ec 'psql -U $POSTGRES_USER -d $POSTGRES_DB -v ON_ERROR_STOP=1 -q'
    if ($LASTEXITCODE -ne 0) {
        throw "Updating the database password failed with exit code $LASTEXITCODE."
    }

    Write-Host 'Verifying a password login over the network, as the backend connects...'
    & docker compose run --rm --no-deps backup psql -v ON_ERROR_STOP=1 -tAc 'SELECT 1' | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "The password login still failed (exit code $LASTEXITCODE)."
    }

    Write-Host 'Starting the remaining services...'
    Invoke-CheckedDocker -DockerArguments @('compose', 'up', '-d')

    Write-Host 'Database password synchronized with .env.'
}
finally {
    Pop-Location
}
