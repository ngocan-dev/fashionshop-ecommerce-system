@echo off
chcp 65001 >nul
echo.
echo ==========================================
echo   FASHIONSHOP - Starting the system
echo ==========================================
echo.

set ROOT=%~dp0
set BACKEND=%ROOT%fashionshop-backend
set FRONTEND=%ROOT%fashionshop-frontend
set SQLFILE=%ROOT%database\ecommerce_db.sql

:: ---- Tim JDK 17 cho Backend ----
set "JAVA17_HOME="
if exist "C:\Program Files\Java\jdk-17\bin\java.exe" set "JAVA17_HOME=C:\Program Files\Java\jdk-17"

if "%JAVA17_HOME%"=="" (
    for /d %%D in ("C:\Program Files\Java\jdk-17*") do (
        if exist "%%~fD\bin\java.exe" (
            set "JAVA17_HOME=%%~fD"
            goto :jdk17_found
        )
    )
)

if "%JAVA17_HOME%"=="" (
    for /d %%D in ("C:\Program Files\Eclipse Adoptium\jdk-17*") do (
        if exist "%%~fD\bin\java.exe" (
            set "JAVA17_HOME=%%~fD"
            goto :jdk17_found
        )
    )
)

if "%JAVA17_HOME%"=="" (
    echo [ERROR] JDK 17 not found. Please install JDK 17 to run backend.
    pause
    exit /b 1
)

:jdk17_found
echo [OK] Using JDK 17: %JAVA17_HOME%

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
echo.
echo Enter MySQL connection settings (same as MySQL Workbench)

echo Host [localhost]:
set /p DBHOST="> "
if "%DBHOST%"=="" set "DBHOST=localhost"

echo Port [3306]:
set /p DBPORT="> "
if "%DBPORT%"=="" set "DBPORT=3306"

echo Username [root]:
set /p DBUSER="> "
if "%DBUSER%"=="" set "DBUSER=root"

echo Schema/Database [ecommerce_db]:
set /p DBNAME="> "
if "%DBNAME%"=="" set "DBNAME=ecommerce_db"

echo Password (leave blank if no password):
set /p DBPASS="> "

set "MYSQL_AUTH=-u %DBUSER%"
if not "%DBPASS%"=="" set "MYSQL_AUTH=-u %DBUSER% -p%DBPASS%"

:: ---- Import database ----
echo.
echo [1/4] Creating database and importing data...
%MYSQL% -h %DBHOST% -P %DBPORT% %MYSQL_AUTH% -e "CREATE DATABASE IF NOT EXISTS %DBNAME% CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>nul
if errorlevel 1 (
    echo [ERROR] Cannot connect to MySQL. Make sure MySQL is running and the password is correct.
    pause
    exit /b 1
)

set "TABLE_COUNT="
for /f "usebackq delims=" %%T in (`%MYSQL% -h %DBHOST% -P %DBPORT% %MYSQL_AUTH% -N -B -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='%DBNAME%';" 2^>nul`) do set "TABLE_COUNT=%%T"
if not defined TABLE_COUNT set "TABLE_COUNT=0"

if "%TABLE_COUNT%"=="0" (
    echo Database is empty. Importing initial schema and data...
    %MYSQL% -h %DBHOST% -P %DBPORT% %MYSQL_AUTH% %DBNAME% < "%SQLFILE%" 2>nul
    if errorlevel 1 (
        echo [ERROR] Failed to import database from %SQLFILE%.
        pause
        exit /b 1
    )
    echo [OK] Database imported.
) else (
    set "CORE_DATA_COUNT="
    for /f "usebackq delims=" %%C in (`%MYSQL% -h %DBHOST% -P %DBPORT% %MYSQL_AUTH% %DBNAME% -N -B -e "SELECT (SELECT COUNT(*) FROM users) + (SELECT COUNT(*) FROM products);" 2^>nul`) do set "CORE_DATA_COUNT=%%C"
    if not defined CORE_DATA_COUNT set "CORE_DATA_COUNT=0"

    if "%CORE_DATA_COUNT%"=="0" (
        echo Database has schema but no seed data. Importing initial schema and data...
        %MYSQL% -h %DBHOST% -P %DBPORT% %MYSQL_AUTH% %DBNAME% < "%SQLFILE%" 2>nul
        if errorlevel 1 (
            echo [ERROR] Failed to import database from %SQLFILE%.
            pause
            exit /b 1
        )
        echo [OK] Database imported.
    ) else (
        echo [OK] Database already has %TABLE_COUNT% tables and %CORE_DATA_COUNT% core records. Skipping import to keep existing data.
    )
)

:: ---- Cap nhat datasource trong application.properties ----
powershell -NoProfile -Command "$file='%BACKEND%\src\main\resources\application.properties'; $jdbc='jdbc:mysql://{0}:{1}/{2}?createDatabaseIfNotExist=true&allowZeroDatetime=true&zeroDateTimeBehavior=convertToNull&serverTimezone=Asia/Ho_Chi_Minh&sessionVariables=sql_mode=''ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION''' -f $env:DBHOST,$env:DBPORT,$env:DBNAME; $content=Get-Content $file; $content=$content -replace '^spring\.datasource\.url=.*$',('spring.datasource.url='+$jdbc); $content=$content -replace '^spring\.datasource\.username=.*$',('spring.datasource.username='+$env:DBUSER); $content=$content -replace '^spring\.datasource\.password=.*$',('spring.datasource.password='+$env:DBPASS); Set-Content -Encoding UTF8 $file $content"

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
start "FashionShop Backend" cmd /k "title FashionShop Backend && cd /d "%BACKEND%" && set "JAVA_HOME=%JAVA17_HOME%" && set "PATH=%JAVA_HOME%\bin;%PATH%" && echo Using JAVA_HOME=%JAVA_HOME% && echo Starting Backend... && mvnw spring-boot:run"

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
