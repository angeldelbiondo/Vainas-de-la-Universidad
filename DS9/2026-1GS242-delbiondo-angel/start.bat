@echo off
echo Iniciando PollClass...

:: Verificar MongoDB
sc query MongoDB | find "RUNNING" >/dev/null 2>&1
if errorlevel 1 (
    echo Iniciando MongoDB...
    net start MongoDB
)

:: Backend (Bun)
echo Iniciando Backend en puerto 3002...
start "PollClass Backend" cmd /k "cd /d %~dp0backend && bun --watch src/index.ts"

:: Esperar 2 segundos
timeout /t 2 /nobreak >/dev/null

:: Frontend (Vite)
echo Iniciando Frontend en puerto 5174...
start "PollClass Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo  PollClass corriendo en:
echo  http://localhost:5174
echo ========================================
pause
