$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Logs = Join-Path $Root "logs"
$PortStart = 3000
$PortEnd = 3010
$ReadyTimeoutSeconds = 90
$LaunchId = Get-Date -Format "yyyyMMdd-HHmmss-fff"
$StartupLog = Join-Path $Logs "startup-$LaunchId.log"
$StartupError = Join-Path $Logs "startup-$LaunchId-error.log"

New-Item -ItemType Directory -Force -Path $Logs | Out-Null

Set-Location -LiteralPath $Root

function Get-ListeningPort([int]$Port) {
  return @(Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
}

function Get-ProjectServerProcess {
  Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
    Where-Object {
      $_.CommandLine -and
      $_.CommandLine -match "next[\\/]dist[\\/](bin[\\/]next|server[\\/]lib[\\/]start-server\.js)|next dev|next start" -and
      $_.CommandLine -match [regex]::Escape($Root)
    }
}

$existing = @(Get-ProjectServerProcess)
if ($existing.Count -gt 0) {
  $existingProcessIds = @($existing | Select-Object -ExpandProperty ProcessId)
  $existingPort = Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
    Where-Object {
      $existingProcessIds -contains $_.OwningProcess -and
      $_.LocalPort -ge $PortStart -and
      $_.LocalPort -le $PortEnd
    } |
    Select-Object -First 1 -ExpandProperty LocalPort
  if ($existingPort) {
    Write-Host "Prompting Buddha is already running on http://localhost:$existingPort"
    Start-Process "http://localhost:$existingPort"
    exit 0
  }
  Write-Host "A Prompting Buddha server process already exists; no duplicate instance was started."
  exit 0
}

# Only prune completed diagnostics. Active launches use unique filenames, so a
# second launcher can never try to delete a file held by the running server.
Get-ChildItem -LiteralPath $Logs -Force -File -ErrorAction SilentlyContinue |
  Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } |
  ForEach-Object {
    try { Remove-Item -LiteralPath $_.FullName -Force -ErrorAction Stop } catch { }
  }

$port = $null
for ($candidate = $PortStart; $candidate -le $PortEnd; $candidate++) {
  if ((Get-ListeningPort $candidate).Count -eq 0) { $port = $candidate; break }
}
if (-not $port) { throw "No free port found in range $PortStart-$PortEnd." }

$npm = (Get-Command npm.cmd -ErrorAction SilentlyContinue).Source
if (-not $npm) { throw "npm.cmd was not found on PATH." }

$server = Start-Process -FilePath $npm -ArgumentList @("run", "dev", "--", "--port", "$port") -WorkingDirectory $Root -RedirectStandardOutput $StartupLog -RedirectStandardError $StartupError -PassThru -WindowStyle Hidden

$ready = $false
for ($i = 0; $i -lt $ReadyTimeoutSeconds; $i++) {
  Start-Sleep -Seconds 1
  if (-not (Get-Process -Id $server.Id -ErrorAction SilentlyContinue)) {
    break
  }
  try {
    $response = Invoke-WebRequest -Uri "http://localhost:$port" -UseBasicParsing -TimeoutSec 2
    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) { $ready = $true; break }
  } catch { }
}

if (-not $ready) {
  $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
  $failure = Join-Path $Logs "failure-$stamp.log"
  "Prompting Buddha launcher failure" | Set-Content -LiteralPath $failure -Encoding UTF8
  "Root: $Root" | Add-Content -LiteralPath $failure -Encoding UTF8
  "Port: $port" | Add-Content -LiteralPath $failure -Encoding UTF8
  "ProcessId: $($server.Id)" | Add-Content -LiteralPath $failure -Encoding UTF8
  if (Test-Path -LiteralPath $StartupLog) {
    "`n--- stdout ---" | Add-Content -LiteralPath $failure -Encoding UTF8
    Get-Content -LiteralPath $StartupLog | Add-Content -LiteralPath $failure -Encoding UTF8
  }
  if (Test-Path -LiteralPath $StartupError) {
    "`n--- stderr ---" | Add-Content -LiteralPath $failure -Encoding UTF8
    Get-Content -LiteralPath $StartupError | Add-Content -LiteralPath $failure -Encoding UTF8
  }
  Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue
  Remove-Item -LiteralPath $StartupLog -Force -ErrorAction SilentlyContinue
  Remove-Item -LiteralPath $StartupError -Force -ErrorAction SilentlyContinue
  Write-Error "The site failed to start. AI diagnostics: $failure"
  exit 1
}

Remove-Item -LiteralPath $StartupLog -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $StartupError -Force -ErrorAction SilentlyContinue
Write-Host "Prompting Buddha is running on http://localhost:$port"
Start-Process "http://localhost:$port"
