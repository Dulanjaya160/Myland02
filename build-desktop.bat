@echo off
REM Myland Desktop Application - Complete Build Script
REM This script builds the complete Windows desktop application

echo ========================================
echo Myland Desktop Application Build Script
echo ========================================
echo.

REM Step 1: Build Backend JAR
echo [Step 1/5] Building backend JAR...
call mvn clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Maven build failed!
    exit /b 1
)
echo Backend JAR built successfully!
echo.

REM Step 2: Create minimal JRE with jlink
echo [Step 2/5] Creating minimal Java runtime with jlink...
if exist electron\resources\jre (
    echo Removing existing JRE...
    rmdir /s /q electron\resources\jre
)
call jlink --add-modules java.base,java.logging,java.naming,java.desktop,java.management,java.security.jgss,java.instrument,java.sql,java.xml,jdk.unsupported,java.rmi,java.net.http,jdk.crypto.ec,java.security.sasl,jdk.charsets,java.transaction.xa --output electron\resources\jre --strip-debug --no-header-files --no-man-pages --compress=2
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: jlink failed! Make sure JDK 17 is installed and in PATH.
    exit /b 1
)
echo JRE created successfully!
echo.

REM Step 3: Copy JAR to Electron resources
echo [Step 3/5] Copying backend JAR to Electron resources...
copy /Y target\myland-system-1.0.0.jar electron\resources\backend.jar
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to copy JAR file!
    exit /b 1
)
echo JAR copied successfully!
echo.

REM Step 4: Install Electron dependencies
echo [Step 4/5] Installing Electron dependencies...
cd electron
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm install failed!
    cd ..
    exit /b 1
)
echo Dependencies installed successfully!
echo.

REM Step 5: Build Windows installer
echo [Step 5/5] Building Windows installer...
call npm run build:win
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Electron build failed!
    cd ..
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
