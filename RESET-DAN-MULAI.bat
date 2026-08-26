@echo off
setlocal
cd /d "%~dp0"
echo ============================================
echo VELOURA - RESET CACHE DAN MULAI
 echo ============================================
if exist .next rmdir /s /q .next
if not exist node_modules (
  echo Menginstall dependency...
  call npm install
  if errorlevel 1 goto fail
)
echo Menjalankan website...
call npm run dev
exit /b %errorlevel%
:fail
echo.
echo Instalasi gagal. Biarkan jendela ini terbuka dan kirim screenshot error kepada developer.
pause
