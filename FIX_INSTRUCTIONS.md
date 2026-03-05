# Fix Instructions for Backend Error

## What Was Fixed

I've identified and fixed the main issues causing the "Backend Error" when opening your installed application:

### 1. Database Path Configuration Issue
**Problem:** The backend wasn't properly receiving the user data directory path from Electron, causing database initialization to fail.

**Fix:** 
- Updated `Myland02Application.java` to properly handle the user data directory passed from Electron
- Added better path normalization for Windows
- Added detailed startup logging to help diagnose issues

### 2. Electron-Backend Communication
**Problem:** The Electron app wasn't passing the working directory to the Java backend correctly.

**Fix:**
- Updated `main.js` to pass `-Duser.data.dir` system property to Java
- Set proper environment variables
- Improved error logging

### 3. Missing Diagnostic Tools
**Problem:** No easy way to see what's actually failing.

**Fix:**
- Created `TROUBLESHOOTING.md` with comprehensive troubleshooting steps
- Created `diagnose-installed.bat` to test installed applications

## How to Apply the Fixes

### Step 1: Rebuild the Application

Run the build script to create a new installer with the fixes:

```batch
cd Myland02
build-desktop.bat
```

This will:
1. Rebuild the backend JAR with the fixes
2. Create the minimal JRE
3. Build a new Windows installer

### Step 2: Uninstall Old Version

1. Go to Windows Settings > Apps
2. Find "Myland Food Management"
3. Click Uninstall
4. **Important:** Delete the old data folder:
   - Press `Win + R`
   - Type: `%APPDATA%\myland-desktop`
   - Delete the entire folder

### Step 3: Install New Version

1. Navigate to `Myland02\electron\dist\`
2. Run `Myland Food Management-Setup-1.0.0.exe`
3. Follow the installation wizard

### Step 4: Test the Application

The application should now start without errors. If you still see issues:

1. Run the diagnostic tool:
   ```batch
   diagnose-installed.bat
   ```

2. Check the log file at:
   ```
   %APPDATA%\myland-desktop\backend.log
   ```

## What Changed in the Code

### Myland02Application.java
- Added support for `user.data.dir` system property
- Improved path handling for Windows
- Added comprehensive startup logging
- Better error handling with exit codes

### electron/main.js
- Pass user data directory to Java via system property
- Set environment variables properly
- Improved error messages

## Common Issues After Fix

### Issue: "Port 8080 already in use"
**Solution:** Make sure no other application is using port 8080. Close any other instances of Myland or other web servers.

### Issue: Still getting backend error
**Solution:** 
1. Check `%APPDATA%\myland-desktop\backend.log` for specific errors
2. Run `diagnose-installed.bat` to see detailed output
3. Make sure you completely uninstalled the old version

### Issue: Application won't install
**Solution:**
1. Run the installer as Administrator
2. Choose a simple installation path (no special characters)
3. Make sure you have enough disk space (~200MB)

## Testing in Development Mode

Before building the installer, you can test the fixes:

1. Build the backend:
   ```batch
   mvn clean package -DskipTests
   ```

2. Copy the JAR:
   ```batch
   copy target\myland-system-1.0.0.jar electron\resources\backend.jar
   ```

3. Run in development mode:
   ```batch
   cd electron
   npm start
   ```

4. Watch the console for any errors

## Additional Improvements Made

1. **Better Logging:** The backend now logs detailed startup information
2. **Path Normalization:** Windows paths are properly handled
3. **Error Messages:** More descriptive error messages
4. **Diagnostic Tools:** Easy-to-use tools to troubleshoot issues

## Need More Help?

If you still have issues after applying these fixes:

1. Run `diagnose-installed.bat`
2. Collect the output and the `backend.log` file
3. Check `TROUBLESHOOTING.md` for more solutions
4. Look for specific error messages in the logs

## Prevention

To avoid similar issues in the future:

- Always test in development mode before building the installer
- Check the backend logs during development
- Use the diagnostic tools to verify the build
- Keep backups of working versions
