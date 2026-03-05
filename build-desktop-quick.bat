@echo off
REM Quick build script - assumes npm dependencies are already installed

echo ========================================
echo Myland Desktop - Quick Build
echo ========================================
echo.

REM Step 1: Build Backend JAR
echo [Step 1/3] Building backend JAR...
call mvn clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Maven build failed!
    pause
    exit /b 1
)
echo Backend JAR built successfully!
echo.

REM Step 2: Copy JAR to Electron resources
echo [Step 2/3] Copying backend JAR to Electron resources...
copy /Y target\myland-system-1.0.0.jar electron\resources\backend.jar
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to copy JAR file!
    pause
    exit /b 1
)
echo JAR copied successfully!
echo.

REM Step 3: Build Windows installer
echo [Step 3/3] Building Windows installer...
cd electron

REM Check if npm is available
where npm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo npm found, building with electron-builder...
    call npm run build:win
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Electron build failed!
        cd ..
        pause
        exit /b 1
    )
) else (
    echo WARNING: npm not found in PATH
    echo.
    echo Please install Node.js and npm, then run:
    echo   cd electron
    echo   npm install
    echo   npm run build:win
    echo.
    cd ..
    pause
    exit /b 1
)

cd ..
echo.

echo ========================================
echo Build completed successfully!
echo ========================================
echo.
echo Installer location:
echo electron\dist\Myland Food Management-Setup-1.0.0.exe
echo.
pause
