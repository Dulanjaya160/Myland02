@echo off
echo ========================================
echo Myland Food Management - Data Backup
echo ========================================
echo.

set "APPDATA_DIR=%APPDATA%\myland-desktop"
set "BACKUP_DIR=%APPDATA_DIR%\backups"

:: Create timestamp (YYYYMMDD_HHMMSS)
set "TIMESTAMP=%DATE:~10,4%%DATE:~4,2%%DATE:~7,2%_%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%"
:: Replace spaces with zeros if any (e.g. for single digit hours)
set "TIMESTAMP=%TIMESTAMP: =0%"

if not exist "%APPDATA_DIR%\myland.db" (
    echo ERROR: Database file not found at:
    echo %APPDATA_DIR%\myland.db
    echo.
    echo Please make sure the application has been run at least once.
    pause
    exit /b 1
)

if not exist "%BACKUP_DIR%" (
    echo Creating backup directory: %BACKUP_DIR%
    mkdir "%BACKUP_DIR%"
)

echo Source: %APPDATA_DIR%\myland.db
echo Target: %BACKUP_DIR%\myland_backup_%TIMESTAMP%.db
echo.

copy "%APPDATA_DIR%\myland.db" "%BACKUP_DIR%\myland_backup_%TIMESTAMP%.db" /V

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS: Backup created successfully!
    echo ========================================
    echo.
    echo You can find your backups at:
    echo %BACKUP_DIR%
) else (
    echo.
    echo ERROR: Backup failed!
)

echo.
pause
