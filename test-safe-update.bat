@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Testing Safe Update Logic
echo ========================================
echo.

:: 1. Setup Mock Environment
set "TEST_ROOT=%TEMP%\myland_update_test"
set "APPDATA_DIR=%TEST_ROOT%\myland-desktop"
set "BACKUP_DIR=%APPDATA_DIR%\backups"

if exist "%TEST_ROOT%" rmdir /s /q "%TEST_ROOT%"
mkdir "%APPDATA_DIR%"

echo [1/4] Creating mock database...
echo "Dummy Data" > "%APPDATA_DIR%\myland.db"

:: 2. Simulate UPDATE_NOW.bat Logic
echo [2/4] Running update logic simulation...
set "TIMESTAMP=%DATE:~10,4%%DATE:~4,2%%DATE:~7,2%_%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%"
set "TIMESTAMP=%TIMESTAMP: =0%"

if exist "%APPDATA_DIR%\myland.db" (
    if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
    echo Backing up database...
    copy "%APPDATA_DIR%\myland.db" "%BACKUP_DIR%\myland_backup_%TIMESTAMP%.db" >nul
)

:: 3. Verification
echo [3/4] Verifying results...

set "FILE_COUNT=0"
for %%A in ("%BACKUP_DIR%\myland_backup_*.db") do set /a FILE_COUNT+=1

if not exist "%APPDATA_DIR%\myland.db" (
    echo [FAILED] Original database was deleted!
    goto :end
)

if %FILE_COUNT% EQU 0 (
    echo [FAILED] No backup was created!
    goto :end
)

echo [SUCCESS] Original database preserved.
echo [SUCCESS] Backup created in: %BACKUP_DIR%

:: 4. Cleanup
:end
echo.
echo [4/4] Cleanup...
rmdir /s /q "%TEST_ROOT%"
echo Done!
pause
