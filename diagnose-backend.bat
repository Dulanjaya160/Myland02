@echo off
echo ========================================
echo Myland Backend Diagnostics
echo ========================================
echo.

set JAVA_PATH=electron\resources\jre\bin\java.exe
set JAR_PATH=electron\resources\backend.jar

if not exist "%JAVA_PATH%" (
    echo ERROR: Bundled JRE not found at %JAVA_PATH%
    echo Please run build-desktop.bat first.
    pause
    exit /b 1
)

if not exist "%JAR_PATH%" (
    echo ERROR: Backend JAR not found at %JAR_PATH%
    echo Please run build-desktop.bat first.
    pause
    exit /b 1
)

echo Starting backend manually to see errors...
echo Press Ctrl+C to stop.
echo.

"%JAVA_PATH%" -jar "%JAR_PATH%"

pause
