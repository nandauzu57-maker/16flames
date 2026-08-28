@echo off
setlocal EnableExtensions
cd /d "%~dp0"
<<<<<<< HEAD
title 16flames - Setup & Validasi Resend

echo ==============================================
echo      16FLAMES - SETUP EMAIL NOTIFIKASI
=======
title Veloura - Setup & Validasi Resend

echo ==============================================
echo      VELOURA - SETUP EMAIL NOTIFIKASI
>>>>>>> 7945d3e52462ae5b2a03b664ee77d9025c89f585
echo ==============================================
echo.
echo API Key tidak akan ditampilkan di layar.
echo Buat API Key BARU di: https://resend.com/api-keys
echo.
set /p "KEY=Paste API Key Resend (diawali re_): "
if not defined KEY (
  echo ERROR: API Key kosong.
  pause
  exit /b 1
)
if /i not "%KEY:~0,3%"=="re_" (
  echo ERROR: API Key harus diawali re_
  pause
  exit /b 1
)
set "VEL_KEY=%KEY%"
<<<<<<< HEAD
set "VEL_TO=EMAIL_KAMU@example.com"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$k=$env:VEL_KEY; $to=$env:VEL_TO; try { $headers=@{Authorization=('Bearer '+$k)}; $body=@{from='16flames <onboarding@resend.dev>';to=@($to);subject='16flames - Test API Key';html='<p>Test koneksi Resend 16flames berhasil.</p>'} | ConvertTo-Json -Compress; $r=Invoke-WebRequest -UseBasicParsing -Method Post -Uri 'https://api.resend.com/emails' -Headers $headers -ContentType 'application/json' -Body $body -ErrorAction Stop; Write-Host 'VALID: Resend menerima API Key dan test email.'; exit 0 } catch { $code=$_.Exception.Response.StatusCode.value__; $reader=$_.Exception.Response.GetResponseStream(); $sr=New-Object IO.StreamReader($reader); $txt=$sr.ReadToEnd(); Write-Host ('GAGAL: HTTP '+$code); Write-Host $txt; exit 1 }"
=======
set "VEL_TO=nandauzu57@gmail.com"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$k=$env:VEL_KEY; $to=$env:VEL_TO; try { $headers=@{Authorization=('Bearer '+$k)}; $body=@{from='Veloura <onboarding@resend.dev>';to=@($to);subject='Veloura - Test API Key';html='<p>Test koneksi Resend Veloura berhasil.</p>'} | ConvertTo-Json -Compress; $r=Invoke-WebRequest -UseBasicParsing -Method Post -Uri 'https://api.resend.com/emails' -Headers $headers -ContentType 'application/json' -Body $body -ErrorAction Stop; Write-Host 'VALID: Resend menerima API Key dan test email.'; exit 0 } catch { $code=$_.Exception.Response.StatusCode.value__; $reader=$_.Exception.Response.GetResponseStream(); $sr=New-Object IO.StreamReader($reader); $txt=$sr.ReadToEnd(); Write-Host ('GAGAL: HTTP '+$code); Write-Host $txt; exit 1 }"
>>>>>>> 7945d3e52462ae5b2a03b664ee77d9025c89f585
if errorlevel 1 (
  echo.
  echo API Key DITOLAK Resend. Jangan simpan key ini.
  pause
  exit /b 1
)

<<<<<<< HEAD
powershell -NoProfile -ExecutionPolicy Bypass -Command "$p='.env.local'; $k=$env:VEL_KEY; $t=Get-Content -Raw -LiteralPath $p -ErrorAction SilentlyContinue; if(-not $t){$t='PAYPAL_ENV=sandbox`r`nPAYPAL_CLIENT_ID=CLIENT_ID_KAMU`r`nPAYPAL_CLIENT_SECRET=SECRET_KAMU`r`nNEXT_PUBLIC_PAYPAL_CLIENT_ID=CLIENT_ID_KAMU`r`nNEXT_PUBLIC_SITE_URL=http://localhost:3000`r`n'}; if($t -notmatch '(?m)^BRAND_ORDER_EMAIL='){ $t += "`r`nBRAND_ORDER_EMAIL=EMAIL_KAMU@example.com`r`n" }; if($t -notmatch '(?m)^BRAND_FROM_EMAIL='){ $t += 'BRAND_FROM_EMAIL=16flames <onboarding@resend.dev>`r`n' }; if($t -notmatch '(?m)^RESEND_API_KEY='){ $t += 'RESEND_API_KEY='+$k+"`r`n" } else { $t=[regex]::Replace($t,'(?m)^RESEND_API_KEY=.*$','RESEND_API_KEY='+$k) }; Set-Content -LiteralPath $p -Value $t -Encoding utf8"
=======
powershell -NoProfile -ExecutionPolicy Bypass -Command "$p='.env.local'; $k=$env:VEL_KEY; $t=Get-Content -Raw -LiteralPath $p -ErrorAction SilentlyContinue; if(-not $t){$t='PAYPAL_ENV=sandbox`r`nPAYPAL_CLIENT_ID=CLIENT_ID_KAMU`r`nPAYPAL_CLIENT_SECRET=SECRET_KAMU`r`nNEXT_PUBLIC_PAYPAL_CLIENT_ID=CLIENT_ID_KAMU`r`nNEXT_PUBLIC_SITE_URL=http://localhost:3000`r`n'}; if($t -notmatch '(?m)^BRAND_ORDER_EMAIL='){ $t += "`r`nBRAND_ORDER_EMAIL=nandauzu57@gmail.com`r`n" }; if($t -notmatch '(?m)^BRAND_FROM_EMAIL='){ $t += 'BRAND_FROM_EMAIL=Veloura <onboarding@resend.dev>`r`n' }; if($t -notmatch '(?m)^RESEND_API_KEY='){ $t += 'RESEND_API_KEY='+$k+"`r`n" } else { $t=[regex]::Replace($t,'(?m)^RESEND_API_KEY=.*$','RESEND_API_KEY='+$k) }; Set-Content -LiteralPath $p -Value $t -Encoding utf8"
>>>>>>> 7945d3e52462ae5b2a03b664ee77d9025c89f585
if errorlevel 1 (
  echo Gagal menyimpan .env.local
  pause
  exit /b 1
)

echo.
echo ==============================================
echo BERHASIL: API Key valid dan sudah disimpan.
echo Test email juga sudah dikirim ke %VEL_TO%.
echo ==============================================
echo.
echo SEKARANG TUTUP server Next.js lalu jalankan START-WEBSITE.bat lagi.
echo Setelah itu buka http://localhost:3000/test-order-email
echo.
pause
