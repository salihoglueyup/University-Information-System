@echo off
setlocal
cd /d "%~dp0"

TITLE UBIS (University Information System) Yonetici Konsolu

:menu
cls
echo ========================================================
echo       UBIS Projesi Yonetim Menusu
echo ========================================================
echo.
echo  [1] Tum sistemi derle ve baslat (Docker Compose)
echo  [2] Sistemi baslat (Mevcut imajlarla)
echo  [3] Sistemi durdur (Agi ve konteynerleri kapat)
echo  [4] Sistemi durdur ve verileri temizle (Volumes dahil!)
echo  [5] Sunucu - Server loglarini izle
echo  [6] Istemci - Client loglarini izle
echo  [7] Bagimliliklari yukle (Local: npm install)
echo  [8] Cikis
echo.
echo ========================================================
set /p option="Lutfen bir islem secin (1-8): "

if "%option%"=="1" goto build_and_start
if "%option%"=="2" goto start
if "%option%"=="3" goto stop
if "%option%"=="4" goto stop_and_clean
if "%option%"=="5" goto log_server
if "%option%"=="6" goto log_client
if "%option%"=="7" goto install_local
if "%option%"=="8" goto end
goto menu

:build_and_start
echo.
echo [UBIS] Docker Compose ile servisler derleniyor ve ayaga kaldiriliyor...
docker compose -f docker\docker-compose.yml --profile gateway up -d --build
echo Islem tamamlandi.
pause
goto menu

:start
echo.
echo [UBIS] Servisler baslatiliyor...
docker compose -f docker\docker-compose.yml --profile gateway up -d
echo Islem tamamlandi.
pause
goto menu

:stop
echo.
echo [UBIS] Servisler durduruluyor...
docker compose -f docker\docker-compose.yml down
echo Islem tamamlandi.
pause
goto menu

:stop_and_clean
echo.
echo [DIKKAT] Tum DB ^(Mongo, Redis^) ve Meilisearch verileri SILINECEKTIR!
set /p confirm="Emin misiniz? (E/H): "
if /i "%confirm%"=="E" (
    docker compose -f docker\docker-compose.yml down -v
    echo Kapsamli temizlik yapildi.
) else (
    echo Islem iptal edildi.
)
pause
goto menu

:log_server
echo.
echo [UBIS] Sunucu ^(Server^) loglari gosteriliyor. Cikmak icin CTRL+C yapin.
docker compose -f docker\docker-compose.yml logs -f server
pause
goto menu

:log_client
echo.
echo [UBIS] Istemci ^(Client^) loglari gosteriliyor. Cikmak icin CTRL+C yapin.
docker compose -f docker\docker-compose.yml logs -f client
pause
goto menu

:install_local
echo.
echo [UBIS] Yerel gelistirme icin NPM modulleri indiriliyor...
echo -- Istemci ^(Client^) --
cd client
call npm install
cd ..
echo -- Sunucu ^(Server^) --
cd server
call npm install
cd ..
echo Islem tamamlandi.
pause
goto menu

:end
exit
