# Myland Desktop Application - Build Instructions

## Prerequisites
- Java Development Kit (JDK) 17 or higher installed
- Maven installed
- Node.js 18+ and npm installed

## Build Process

### Step 1: Build the Backend JAR

```powershell
# From the project root directory
mvn clean package -DskipTests
```

This creates `target/myland-system-1.0.0.jar`

### Step 2: Create Minimal Java Runtime with jlink

```powershell
# Create a minimal JRE (Java 17) with only required modules
jlink --add-modules java.base,java.sql,java.naming,java.desktop,java.management,java.instrument,java.xml,jdk.unsupported,jdk.crypto.ec --output electron/resources/jre --strip-debug --no-header-files --no-man-pages --compress=2
```

**Note:** This command must be run from a machine with JDK 17 installed. The jlink tool is included in the JDK.

### Step 3: Copy Backend JAR to Electron Resources

```powershell
# Copy the built JAR to electron resources
copy target\myland-system-1.0.0.jar electron\resources\backend.jar
```

### Step 4: Install Electron Dependencies

```powershell
# Navigate to electron directory
cd electron

# Install dependencies
npm install
```

### Step 5: Build the Windows Installer

```powershell
# Still in electron directory
npm run build:win
```

This creates the installer in `electron/dist/Myland Food Management-Setup-1.0.0.exe`

## Complete Build Script (All Steps)

```powershell
# Run from project root
mvn clean package -DskipTests
jlink --add-modules java.base,java.sql,java.naming,java.desktop,java.management,java.instrument,java.xml,jdk.unsupported,jdk.crypto.ec --output electron/resources/jre --strip-debug --no-header-files --no-man-pages --compress=2
copy target\myland-system-1.0.0.jar electron\resources\backend.jar
cd electron
npm install
npm run build:win
```

## Testing in Development Mode

Before building the installer, you can test the Electron app:

```powershell
# Make sure backend JAR and JRE are in place
cd electron
npm start
```

## Output

The final installer will be located at:
```
electron/dist/Myland Food Management-Setup-1.0.0.exe
```

This is a single-file installer that includes:
- Electron application
- Spring Boot backend JAR
- Bundled Java 17 runtime
- All required dependencies

## Installation

Users can simply run the installer. No Java installation required on their machine.

The application will:
1. Install to `C:\Program Files\Myland Food Management\` (or user-selected directory)
2. Create desktop and start menu shortcuts
3. Store data in `%USERPROFILE%\.myland\myland.db`

## Troubleshooting

### jlink not found
- Ensure JDK 17 (not JRE) is installed
- Add JDK bin directory to PATH
- Example: `C:\Program Files\Java\jdk-17\bin`

### Backend fails to start
- Check that JRE was created correctly in `electron/resources/jre`
- Check that `backend.jar` exists in `electron/resources/`
- Check console logs when running `npm start`

### Build fails
- Ensure all dependencies are installed: `npm install`
- Check that icon.ico exists in electron directory
- Verify electron-builder version is compatible
