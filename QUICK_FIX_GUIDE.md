# Quick Fix Guide - Backend Error

## The Problem
Your installed application shows: **"Backend Error: The application backend has stopped unexpectedly"**

## The Solution (3 Simple Steps)

### Step 1: Test the Fix
```batch
test-backend-fix.bat
```
This will build and test the backend. Wait until you see "Started Myland02Application" then press Ctrl+C.

### Step 2: Build New Installer
```batch
build-desktop.bat
```
This creates a new installer with the fixes (takes 5-10 minutes).

### Step 3: Reinstall
1. Uninstall the old version from Windows Settings
2. Delete `%APPDATA%\myland-desktop` folder
3. Install from `electron\dist\Myland Food Management-Setup-1.0.0.exe`

## What If It Still Doesn't Work?

### Check the Log
```batch
diagnose-installed.bat
```
This shows you exactly what's failing.

### Common Issues

**"Port 8080 already in use"**
- Close other applications using port 8080
- Restart your computer

**"Permission denied"**
- Run installer as Administrator
- Check antivirus isn't blocking it

**"Database error"**
- Delete `%APPDATA%\myland-desktop\myland.db`
- Restart the application

## Files Created to Help You

- `FIX_INSTRUCTIONS.md` - Detailed explanation of all fixes
- `TROUBLESHOOTING.md` - Complete troubleshooting guide
- `diagnose-installed.bat` - Test installed application
- `test-backend-fix.bat` - Test the fix before building

## What Was Fixed?

1. **Database path handling** - Now properly uses Electron's user data directory
2. **Windows path issues** - Fixed path separators and normalization
3. **Error logging** - Added detailed logs to help diagnose issues
4. **Startup sequence** - Improved backend initialization

## Need More Details?

Read `FIX_INSTRUCTIONS.md` for complete technical details.
