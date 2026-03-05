# Myland Food Management System - Desktop Application

## Overview

This is a professional Windows desktop application built with Electron that wraps the Spring Boot backend. The application includes everything needed to run - no external Java installation required.

## Features

✅ **Fully Offline** - No internet connection required  
✅ **Self-Contained** - Bundled Java runtime included  
✅ **Single Instance** - Prevents multiple app instances  
✅ **Data Persistence** - SQLite database in user directory  
✅ **Professional Installer** - NSIS installer with shortcuts  
✅ **Clean Shutdown** - Graceful backend termination  
✅ **Auto-Start Backend** - Backend starts automatically on launch  

## Quick Start for Developers

### Prerequisites
- JDK 17+ (for jlink)
- Maven
- Node.js 18+

### Build the Desktop Application

```powershell
# Run the automated build script
.\build-desktop.bat
```

Or manually:

```powershell
# 1. Build backend JAR
mvn clean package -DskipTests

# 2. Create minimal JRE
jlink --add-modules java.base,java.sql,java.naming,java.desktop,java.management,java.instrument,java.xml,jdk.unsupported,jdk.crypto.ec --output electron\resources\jre --strip-debug --no-header-files --no-man-pages --compress=2

# 3. Copy JAR
copy target\myland-system-1.0.0.jar electron\resources\backend.jar

# 4. Install dependencies and build
cd electron
npm install
npm run build:win
```

### Output

The installer will be created at:
```
electron/dist/Myland Food Management-Setup-1.0.0.exe
```

## For End Users

### Installation

1. Download `Myland Food Management-Setup-1.0.0.exe`
2. Run the installer
3. Choose installation directory (default: `C:\Program Files\Myland Food Management`)
4. Click Install
5. Launch from desktop shortcut or start menu

### Data Location

All data is stored in:
```
%USERPROFILE%\.myland\myland.db
```

This ensures data persists across updates and reinstalls.

### Uninstallation

Use Windows "Add or Remove Programs" or run the uninstaller from the installation directory.

**Note:** By default, your data is preserved during uninstallation. To completely remove all data, manually delete the `.myland` folder from your user directory.

## Architecture

```
Desktop Application
├── Electron (Chromium-based UI)
│   ├── Single instance lock
│   ├── Backend health monitoring
│   └── Graceful shutdown handling
├── Spring Boot Backend (JAR)
│   ├── REST API
│   ├── Business logic
│   └── Database access
├── Bundled JRE (Java 17)
│   └── Minimal runtime (~50MB)
└── SQLite Database
    └── Stored in user directory
```

## Technical Details

### Backend Startup
1. Electron launches bundled JRE
2. JRE starts backend JAR
3. Health checks poll `http://localhost:8080`
4. UI loads once backend is ready

### Port Configuration
- **Backend:** Fixed to port 8080
- **Frontend:** Loaded from `http://localhost:8080`

### Security
- Context isolation enabled
- Node integration disabled
- Dev tools disabled in production
- No external network access required

## Development

### Test in Development Mode

```powershell
cd electron
npm start
```

This launches the Electron app without building an installer.

### Debugging

Backend logs are visible in the Electron console when running in development mode.

## Troubleshooting

### "Backend failed to start"
- Ensure JRE was created correctly in `electron/resources/jre`
- Check that `backend.jar` exists in `electron/resources/`
- Verify port 8080 is not in use

### "jlink not found"
- Install JDK 17 (not just JRE)
- Add JDK bin directory to PATH

### Build fails
- Run `npm install` in electron directory
- Ensure icon.ico exists (see electron/ICON_README.md)
- Check electron-builder version compatibility

## File Structure

```
Myland02/
├── src/                    # Spring Boot source code
├── target/                 # Maven build output
├── electron/               # Electron wrapper
│   ├── main.js            # Main process (backend launcher)
│   ├── preload.js         # Preload script
│   ├── package.json       # Dependencies & build config
│   ├── icon.ico           # Application icon
│   ├── BUILD.md           # Build instructions
│   ├── resources/         # Bundled resources
│   │   ├── backend.jar    # Built Spring Boot JAR
│   │   └── jre/           # Custom Java runtime
│   └── dist/              # Build output (installer)
└── build-desktop.bat      # Automated build script
```

## License

MIT License - See LICENSE file for details

## Support

For issues or questions, please contact support or create an issue in the repository.
