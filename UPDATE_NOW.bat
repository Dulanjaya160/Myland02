@echo off
echo ========================================
echo Myland Food Management - Quick Update
echo ========================================
echo.
echo This will:
echo 1. Close the running application
echo 2. Guide you through reinstallation
echo.
pause

echo.
echo Step 1: Closing the application...
echo.
taskkill /F /IM "Myland Food Management.exe" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Application closed successfully!
) else (
    echo Application is not running or already closed.
)
echo.

echo Step 2: Opening Windows Settings to uninstall...
echo.
echo Please:
echo 1. Find "Myland Food Management" in the list
echo 2. Click Uninstall
echo 3. Come back to this window when done
echo.
start ms-settings:appsfeatures
pause

echo Step 3: Backing up current data...
echo.
set "APPDATA_DIR=%APPDATA%\myland-desktop"
set "BACKUP_DIR=%APPDATA_DIR%\backups"
set "TIMESTAMP=%DATE:~10,4%%DATE:~4,2%%DATE:~7,2%_%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%"
set "TIMESTAMP=%TIMESTAMP: =0%"

if exist "%APPDATA_DIR%\myland.db" (
    if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
    echo Backing up database to: %BACKUP_DIR%\myland_backup_%TIMESTAMP%.db
    copy "%APPDATA_DIR%\myland.db" "%BACKUP_DIR%\myland_backup_%TIMESTAMP%.db" >nul
    echo Backup created successfully!
) else (
    echo No existing database found to back up.
)
echo.
echo NOTE: Your existing data folder (%APPDATA_DIR%) is being PRESERVED.
echo Your settings and records will remain available after the update.
echo.

echo Step 4: Installing new version...
echo.
set "INSTALLER=electron\dist\Myland Food Management-Setup-1.0.0.exe"
if exist "%INSTALLER%" (
    echo Starting installer...
    start "" "%INSTALLER%"
    echo.
    echo Please complete the installation wizard.
    echo After installation, launch the application and test it!
) else (
    echo ERROR: Installer not found at %INSTALLER%
    echo Please run build-desktop.bat first.
)
echo.

echo ========================================
echo Update process complete!
echo ========================================
echo.
echo After installation:
echo 1. Launch "Myland Food Management"
echo 2. Test the Production page
echo 3. Everything should work now!
echo.
pause
