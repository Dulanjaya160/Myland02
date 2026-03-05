@echo off
echo ========================================
echo Myland Installed App Diagnostics
echo ========================================
echo.

REM Find the installed application
set "INSTALL_DIR=%LOCALAPPDATA%\Programs\myland-desktop"
set "APPDATA_DIR=%APPDATA%\myland-desktop"

echo Checking installation...
echo.

if not exist "%INSTALL_DIR%" (
    echo ERROR: Application not found at %INSTALL_DIR%
    echo Please install the application first.
    echo.
    pause
    exit /b 1
)

echo Installation directory: %INSTALL_DIR%
echo User data directory: %APPDATA_DIR%
echo.

REM Check for JRE
set "JAVA_PATH=%INSTALL_DIR%\resources\jre\bin\java.exe"
if not exist "%JAVA_PATH%" (
    echo ERROR: Java runtime not found at %JAVA_PATH%
    echo The installation may be corrupted.
    echo.
    pause
    exit /b 1
)
echo [OK] Java runtime found

REM Check for backend JAR
set "JAR_PATH=%INSTALL_DIR%\resources\backend.jar"
if not exist "%JAR_PATH%" (
    echo ERROR: Backend JAR not found at %JAR_PATH%
    echo The installation may be corrupted.
    echo.
    pause
    exit /b 1
)
echo [OK] Backend JAR found

REM Check user data directory
if not exist "%APPDATA_DIR%" (
    echo Creating user data directory...
    mkdir "%APPDATA_DIR%"
)
echo [OK] User data directory ready

REM Check for log file
set "LOG_FILE=%APPDATA_DIR%\backend.log"
if exist "%LOG_FILE%" (
    echo.
    echo ========================================
    echo Recent Backend Log (last 50 lines):
    echo ========================================
    powershell -Command "Get-Content '%LOG_FILE%' -Tail 50"
    echo ========================================
    echo.
)

echo.
echo Starting backend manually for testing...
echo Working directory: %APPDATA_DIR%
echo Press Ctrl+C to stop.
echo.
echo ========================================
echo.

cd /d "%APPDATA_DIR%"
"%JAVA_PATH%" -Duser.data.dir="%APPDATA_DIR%" -Dfile.encoding=UTF-8 -jar "%JAR_PATH%"

echo.
echo ========================================
echo Backend stopped.
echo.
pause
