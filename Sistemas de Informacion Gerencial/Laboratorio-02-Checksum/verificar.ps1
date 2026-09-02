# Verifica la integridad de las tres evidencias del Laboratorio #2 (Windows)
Set-Location -Path $PSScriptRoot
Write-Host "SHA-256 de las evidencias:" -ForegroundColor Cyan
Get-ChildItem .\evidencia\*.txt | ForEach-Object {
    $h = Get-FileHash $_.FullName -Algorithm SHA256
    "{0,-22} {1}" -f $_.Name, $h.Hash.ToLower()
}
Write-Host ""
$a = (Get-FileHash .\evidencia\01-original.txt   -Algorithm SHA256).Hash
$b = (Get-FileHash .\evidencia\03-restaurado.txt -Algorithm SHA256).Hash
if ($a -eq $b) {
    Write-Host "[OK] Estado 1 y Estado 3 tienen el mismo SHA-256." -ForegroundColor Green
} else {
    Write-Host "[ERROR] Estado 1 y Estado 3 difieren." -ForegroundColor Red
}
