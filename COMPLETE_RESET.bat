@echo off
echo ========================================
echo Myland - COMPLETE RESET AND REINSTALL
echo ========================================
echo.
echo This will:
echo 1. Close the application
echo 2. Uninstall old version
echo 3. Delete ALL data (fresh start)
echo 4. Install new version
echo.
echo WARNING: This will delete all your data!
echo Make sure you have backups if needed.
echo.
pause

echo.
echo [1/5] Closing application...
taskkill /F /IM "Myland Food Management.exe" 2>nul
timeout /t 2 >nul

echo.
echo [2/5] Please uninstall from Windows Settings...
echo.
echo 1. Press Win + I
echo 2. Go to Apps
echo 3. Find "Myland Food Management"
echo 4. Click Uninstall
echo 5. Come back here when done
echo.
start ms-settings:appsfeatures
pause

echo.
echo [3/5] Deleting old data...
set "APPDATA_DIR=%APPDATA%\myland-desktop"
set "LOCALAPPDATA_DIR=%LOCALAPPDATA%\myland-desktop"

if exist "%APPDATA_DIR%" (
    echo Deleting: %APPDATA_DIR%
    rmdir /s /q "%APPDATA_DIR%"
    echo Done!
) else (
    echo No data found in APPDATA
)

if exist "%LOCALAPPDATA_DIR%" (
    echo Deleting: %LOCALAPPDATA_DIR%
    rmdir /s /q "%LOCALAPPDATA_DIR%"
    echo Done!
) else (
    echo No data found in LOCALAPPDATA
)

echo.
echo [4/5] Installing new version...
set "INSTALLER=electron\dist\Myland Food Management-Setup-1.0.0.exe"

if exist "%INSTALLER%" (
    echo Starting installer...
    start "" "%INSTALLER%"
    echo.
    echo Please complete the installation.
    echo.
    pause
) else (
    echo ERROR: Installer not found!
    echo Expected location: %INSTALLER%
    echo.
    echo Please run: mvn clean package -DskipTests
    echo Then: cd electron
    echo Then: npm run build:win
    echo.
    pause
    exit /b 1
)

echo.
echo [5/5] Testing...
echo.
echo After installation completes:
echo 1. Launch "Myland Food Management"
echo 2. Try adding an ingredient
echo 3. Try adding a product
echo 4. Try adding production
echo.
echo All should work with fresh database!
echo.
pause
