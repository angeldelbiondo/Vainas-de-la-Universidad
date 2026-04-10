# PollClass Launcher - ejecuta este archivo para levantar todo
$Host.UI.RawUI.WindowTitle = "PollClass Launcher"
$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

function Write-Step($msg) { Write-Host "`n>> $msg" -ForegroundColor Cyan }
function Write-OK($msg)   { Write-Host "   [OK] $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "   [!]  $msg" -ForegroundColor Yellow }

Write-Host @"

  ____       _ _  ____ _
 |  _ \ ___ | | |/ ___| | __ _ ___ ___
 | |_) / _ \| | | |   | |/ _`` / __/ __|
 |  __/ (_) | | | |___| | (_| \__ \__ \
 |_|   \___/|_|_|\____|_|\__,_|___/___/

        Launcher v1.0
"@ -ForegroundColor Magenta

# ─── 1. Refrescar PATH ────────────────────────────────────────
$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" +
            [System.Environment]::GetEnvironmentVariable("PATH","User")

# ─── 2. MongoDB ───────────────────────────────────────────────
Write-Step "Verificando MongoDB..."
$mongo = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
if ($null -eq $mongo) {
    Write-Warn "MongoDB no instalado. Instalando con winget..."
    winget install MongoDB.Server --accept-package-agreements --accept-source-agreements
    Start-Service MongoDB
} elseif ($mongo.Status -ne "Running") {
    Write-Warn "MongoDB detenido. Iniciando..."
    Start-Service MongoDB
}
Write-OK "MongoDB corriendo"

# ─── 3. Bun ───────────────────────────────────────────────────
Write-Step "Verificando Bun..."
$bunPath = Get-Command bun -ErrorAction SilentlyContinue
if ($null -eq $bunPath) {
    # Try common install location
    $localBun = "$env:USERPROFILE\.bun\bin\bun.exe"
    if (Test-Path $localBun) {
        $env:PATH += ";$env:USERPROFILE\.bun\bin"
        Write-OK "Bun encontrado en $localBun"
    } else {
        Write-Warn "Bun no encontrado. Instalando..."
        winget install Oven-sh.Bun --accept-package-agreements --accept-source-agreements
        $env:PATH += ";$env:USERPROFILE\.bun\bin"
    }
} else {
    Write-OK "Bun $(bun --version)"
}

# ─── 4. Node.js ───────────────────────────────────────────────
Write-Step "Verificando Node.js..."
if ($null -eq (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Warn "Node.js no encontrado. Instalando..."
    winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
    $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" +
                [System.Environment]::GetEnvironmentVariable("PATH","User")
} else {
    Write-OK "Node.js $(node --version)"
}

# ─── 5. Dependencias backend ──────────────────────────────────
Write-Step "Verificando dependencias del backend..."
$backendDir = "$scriptDir\backend"
if (-not (Test-Path "$backendDir\node_modules")) {
    Write-Warn "Instalando dependencias del backend..."
    Push-Location $backendDir
    bun install
    Pop-Location
}
Write-OK "Backend listo"

# ─── 6. Dependencias frontend ─────────────────────────────────
Write-Step "Verificando dependencias del frontend..."
$frontendDir = "$scriptDir\frontend"
if (-not (Test-Path "$frontendDir\node_modules")) {
    Write-Warn "Instalando dependencias del frontend..."
    Push-Location $frontendDir
    npm install
    Pop-Location
}
Write-OK "Frontend listo"

# ─── 7. Arrancar backend ──────────────────────────────────────
Write-Step "Iniciando Backend (puerto 3002)..."
$bunExe = (Get-Command bun -ErrorAction SilentlyContinue)?.Source
if (-not $bunExe) { $bunExe = "$env:USERPROFILE\.bun\bin\bun.exe" }
Start-Process -FilePath $bunExe `
    -ArgumentList "--watch","src/index.ts" `
    -WorkingDirectory $backendDir `
    -WindowStyle Normal
Start-Sleep -Seconds 3
Write-OK "Backend iniciado"

# ─── 8. Arrancar frontend ─────────────────────────────────────
Write-Step "Iniciando Frontend (puerto 5174)..."
Start-Process -FilePath "cmd.exe" `
    -ArgumentList "/k","npm run dev" `
    -WorkingDirectory $frontendDir `
    -WindowStyle Normal
Start-Sleep -Seconds 5
Write-OK "Frontend iniciado"

# ─── 9. Abrir browser ─────────────────────────────────────────
Write-Step "Abriendo navegador..."
Start-Process "http://localhost:5174"

Write-Host @"

  ==========================================
   PollClass listo en http://localhost:5174
  ==========================================
  Profe : angeldelbiondo@gmail.com  / 12345
  Alumno: angeldelbiondo2@gmail.com / 12345
  ==========================================

  Cierra esta ventana cuando termines.
"@ -ForegroundColor Green

Read-Host "`nPresiona Enter para cerrar el launcher"
