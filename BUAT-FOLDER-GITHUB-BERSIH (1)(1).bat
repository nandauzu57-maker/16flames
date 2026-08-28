@echo off
setlocal

echo ==========================================
echo   16FLAMES - BUAT FOLDER SIAP GITHUB
echo ==========================================
echo.

set "SOURCE=%~dp0"
set "DEST=%~dp016flames-github-clean"

if exist "%DEST%" (
    echo Folder 16flames-github-clean sudah ada.
    echo Hapus folder tersebut dulu jika ingin membuat ulang.
    pause
    exit /b 1
)

echo Menyalin file project...
robocopy "%SOURCE%" "%DEST%" /E /XD ".git" ".next" "node_modules" ".vercel" /XF ".env" ".env.local" ".env.production" ".env.development" ".env.test" >nul

if errorlevel 8 (
    echo.
    echo GAGAL menyalin project.
    pause
    exit /b 1
)

echo.
echo Berhasil!
echo.
echo Folder baru:
echo %DEST%
echo.
echo Folder yang dibuang:
echo - .git
echo - .next
echo - node_modules
echo - .vercel
echo - file .env
echo.
echo Selanjutnya gunakan folder ini untuk GitHub/Vercel.
echo.
pause
