@echo off
echo Checking Myland Database...
echo.

set DB_PATH=%APPDATA%\myland-desktop\myland.db

if not exist "%DB_PATH%" (
    echo Database not found at: %DB_PATH%
    pause
    exit /b 1
)

echo Database found at: %DB_PATH%
echo.

REM Use the bundled JRE to check database
set JAVA_PATH=electron\resources\jre\bin\java.exe

if not exist "%JAVA_PATH%" (
    echo JRE not found. Using system Java...
    set JAVA_PATH=java
)

echo Checking production table...
echo.

"%JAVA_PATH%" -cp "electron\resources\backend.jar" org.sqlite.JDBC "jdbc:sqlite:%DB_PATH%" "SELECT COUNT(*) FROM production"

pause
