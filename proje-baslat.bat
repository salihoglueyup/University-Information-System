@echo off
chcp 65001 > nul
cls
color 0B

echo.
echo  ================================================================
echo        IAU KAMPUS BILGI SISTEMI (UBIS) PROJECT LAUNCHER
echo  ================================================================
echo.

:: 1. Check for Dependencies
echo  [1/4] Gerekli araclar kontrol ediliyor...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo  [HATA] Node.js bulunamadi! Lutfen Node.js yukleyin.
    pause
    exit
)
echo      - Node.js: MEVCUT

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo  [HATA] npm bulunamadi!
    pause
    exit
)
echo      - npm: MEVCUT

:: 2. Check and Install Modules if missing
echo.
echo  [2/4] Bagimliliklar kontrol ediliyor...

if not exist "server\node_modules" (
    echo      - Backend modulleri eksik. Yukleniyor...
    cd server && npm install && cd ..
) else (
    echo      - Backend modulleri: HAZIR
)

if not exist "client\node_modules" (
    echo      - Frontend modulleri eksik. Yukleniyor...
    cd client && npm install && cd ..
) else (
    echo      - Frontend modulleri: HAZIR
)

:: 3. Start Services
echo.
echo  [3/4] Servisler baslatiliyor...

echo      - Backend servisi baslatiliyor (Port 5000)...
start "UBIS Backend Server (Port 5000)" cmd /k "cd server && npm run dev"

echo      - Frontend servisi baslatiliyor (Port 5173)...
start "UBIS Frontend Client (Port 5173)" cmd /k "cd client && npm run dev"

:: 4. Launch Browser
echo.
echo  [4/4] Tarayini aciliyor...
echo.
echo  Lutfen bekleyiniz, sayfa yukleniyor (5 saniye)...
timeout /t 5 > nul
start http://localhost:5173/login

echo.
echo  ================================================================
echo      BASARIYLA BASLATILDI!
echo      Backend: http://localhost:5000
echo      Frontend: http://localhost:5173/login
echo  ================================================================
echo.
echo  Kapatmak icin bu pencereyi kapatabilirsiniz. Servisler calismaya devam edecektir.
pause
