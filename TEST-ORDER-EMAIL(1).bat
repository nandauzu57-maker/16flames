@echo off
setlocal
cd /d "%~dp0"
title Veloura - Test Notifikasi Pesanan
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r=Invoke-RestMethod -Method Post -Uri 'http://localhost:3000/api/test-order-email' -ContentType 'application/json'; $r | ConvertTo-Json -Depth 5 } catch { if($_.ErrorDetails.Message){Write-Host $_.ErrorDetails.Message} else {Write-Host $_.Exception.Message}; exit 1 }"
echo.
echo Jika ok=true, cek Resend > Emails dan Gmail brand.
pause
