@echo off
setlocal
set URL=http://localhost:3000/api/test-email
echo.
echo Mengirim email test Veloura...
echo Pastikan website sedang berjalan.
echo.
powershell -NoProfile -Command "try { $r=Invoke-RestMethod -Method Post -Uri '%URL%' -ContentType 'application/json'; $r | ConvertTo-Json } catch { if ($_.ErrorDetails.Message) { $_.ErrorDetails.Message } else { $_.Exception.Message } }"
echo.
pause
