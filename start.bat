@echo off
chcp 65001 >nul
echo.
echo ==========================================
echo   FASHIONSHOP - Starting the system
echo ==========================================
echo.

set ROOT=%~dp0
set BACKEND=%ROOT%fashionshop-backend-main
set FRONTEND=%ROOT%fashionshop-frontend-main
set SQLFILE=%ROOT%ecommerce_db.sql

:: ---- Tim MySQL ----
set MYSQL=mysql
where mysql >nul 2>&1
if errorlevel 1 (
    if exist "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" (
        set MYSQL="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
    ) else if exist "C:\Program Files\MySQL\MySQL Server 8.1\bin\mysql.exe" (
        set MYSQL="C:\Program Files\MySQL\MySQL Server 8.1\bin\mysql.exe"
    ) else if exist "C:\xampp\mysql\bin\mysql.exe" (
        set MYSQL="C:\xampp\mysql\bin\mysql.exe"
    ) else (
        echo [ERROR] MySQL not found. Please add MySQL to PATH.
        pause
        exit /b 1
    )
)

:: ---- Nhap mat khau MySQL ----
echo Enter your MySQL root password:
set /p DBPASS="> "
if "%DBPASS%"=="" set DBPASS=root

:: ---- Import database ----
echo.
echo [1/4] Creating database and importing data...
%MYSQL% -u root -p%DBPASS% -e "CREATE DATABASE IF NOT EXISTS ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>nul
if errorlevel 1 (
    echo [ERROR] Cannot connect to MySQL. Make sure MySQL is running and the password is correct.
    pause
    exit /b 1
)
%MYSQL% -u root -p%DBPASS% ecommerce_db < "%SQLFILE%" 2>nul
echo [OK] Database ready.

:: ---- Cap nhat mat khau trong application.properties ----
powershell -Command "(Get-Content '%BACKEND%\src\main\resources\application.properties') -replace 'spring.datasource.password=.*', 'spring.datasource.password=%DBPASS%' | Set-Content '%BACKEND%\src\main\resources\application.properties'"

:: ---- Tao .env.local cho frontend ----
echo.
echo [2/4] Configuring frontend...
if not exist "%FRONTEND%\.env.local" (
    echo NEXT_PUBLIC_API_BASE_URL=http://localhost:8081 > "%FRONTEND%\.env.local"
    echo [OK] Created .env.local
) else (
    echo [OK] .env.local already exists.
)

:: ---- Cai npm packages neu chua co ----
echo.
echo [3/4] Checking npm packages...
if not exist "%FRONTEND%\node_modules" (
    echo Installing npm packages, please wait...
    cd /d "%FRONTEND%"
    npm install
    cd /d "%ROOT%"
    echo [OK] npm install complete.
) else (
    echo [OK] node_modules already exists.
)

:: ---- Khoi dong Backend ----
echo.
echo [4/4] Starting Backend and Frontend...
start "FashionShop Backend" cmd /k "title FashionShop Backend && cd /d "%BACKEND%" && echo Starting Backend... && mvnw spring-boot:run"

:: Doi backend khoi dong truoc (30 giay)
echo Waiting for Backend to start (30 seconds)...
timeout /t 30 /nobreak >nul

:: ---- Khoi dong Frontend ----
start "FashionShop Frontend" cmd /k "title FashionShop Frontend && cd /d "%FRONTEND%" && echo Starting Frontend... && npm run dev"

echo.
echo ==========================================
echo   System is starting!
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8081
echo.
echo   Demo accounts:
echo   admin@gmail.com     / 123456
echo   customer@gmail.com  / 123456
echo ==========================================
echo.
echo Open your browser after 10-20 seconds when the Backend finishes starting.
echo Press any key to close this window...
pause >nul
