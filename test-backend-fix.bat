@echo off
echo ========================================
echo Testing Backend Fix
echo ========================================
echo.

echo This script will:
echo 1. Build the backend with the fixes
echo 2. Test it locally
echo 3. Show you if it works
echo.
pause

echo.
echo [1/3] Building backend...
call mvn clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo [2/3] Copying JAR to electron resources...
if not exist electron\resources mkdir electron\resources
copy /Y target\myland-system-1.0.0.jar electron\resources\backend.jar

echo.
echo [3/3] Testing backend startup...
echo.
echo The backend should start and show:
echo - Database location
echo - JDBC URL
echo - "Started Myland02Application"
echo.
echo Press Ctrl+C to stop when you see "Started Myland02Application"
echo.
pause

java -Duser.data.dir=%TEMP%\myland-test -jar target\myland-system-1.0.0.jar

echo.
echo ========================================
echo Test complete!
echo.
echo If you saw "Started Myland02Application", the fix works!
echo You can now run build-desktop.bat to create the installer.
echo ========================================
pause
