@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title Veloura Global Store

echo ==============================================
echo        VELOURA GLOBAL STORE - START
 echo ==============================================
echo.
if not exist "package.json" (
  echo ERROR: package.json tidak ditemukan.
  echo Jalankan file ini dari folder utama website.
  pause
  exit /b 1
)
where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js belum terpasang.
  echo Install Node.js LTS dari https://nodejs.org lalu jalankan lagi.
  pause
  exit /b 1
)
where npm >nul 2>nul
if errorlevel 1 (
  echo ERROR: npm tidak ditemukan.
  pause
  exit /b 1
)
if not exist "node_modules\next" (
  echo Menginstall dependency. Tunggu sampai selesai...
  call npm install
  if errorlevel 1 (
    echo.
    echo ERROR: npm install gagal.
    echo Coba jalankan npm install di Terminal untuk melihat pesan lengkap.
    pause
    exit /b 1
  )
)
if not exist ".env.local" (
  echo .env.local belum ada.
  echo Jalankan SETUP-RESEND.bat terlebih dahulu.
  pause
  exit /b 1
)
findstr /b /c:"RESEND_API_KEY=PASTE_RESEND_API_KEY_HERE" ".env.local" >nul
if not errorlevel 1 (
  echo Resend API key belum diisi.
  echo Jalankan SETUP-RESEND.bat terlebih dahulu.
  pause
  exit /b 1
)
findstr /b /c:"RESEND_API_KEY=re_" ".env.local" >nul
if errorlevel 1 (
  echo Format RESEND_API_KEY tidak valid.
  echo Jalankan SETUP-RESEND.bat lagi dengan key yang dimulai re_
  pause
  exit /b 1
)
echo.
echo Website: http://localhost:3000
echo Test pesanan: http://localhost:3000/test-order-email
echo.
echo Tekan Ctrl+C untuk menghentikan server.
echo.
call npm run dev
pause
