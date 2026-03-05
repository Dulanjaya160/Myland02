# Troubleshooting Guide - Myland Desktop Application

## Backend Error: "The application backend has stopped unexpectedly"

This error occurs when the Spring Boot backend fails to start. Here are the common causes and solutions:

### 1. Check the Backend Log File

The backend writes detailed logs to help diagnose issues:

**Log Location:**
- Windows: `%APPDATA%\myland-desktop\backend.log`
- Full path example: `C:\Users\YourUsername\AppData\Roaming\myland-desktop\backend.log`

**How to view:**
1. Press `Win + R`
2. Type: `%APPDATA%\myland-desktop`
3. Open `backend.log` with Notepad

Look for error messages, especially:
- `java.lang.ClassNotFoundException`
- `java.sql.SQLException`
- `Address already in use` (port 8080 conflict)
- `Permission denied` (file access issues)

### 2. Common Issues and Solutions

#### Issue: Port 8080 Already in Use
**Symptoms:** Backend log shows "Address already in use" or "Port 8080 is already in use"

**Solution:**
1. Close any other applications using port 8080
2. Check for other instances of Myland running
3. Restart your computer

#### Issue: Database Permission Error
**Symptoms:** Backend log shows "Permission denied" or "Cannot create database"

**Solution:**
1. Run the application as Administrator (right-click > Run as administrator)
2. Check that `%APPDATA%\myland-desktop` folder exists and is writable
3. Manually create the folder if needed

#### Issue: Missing Java Runtime
**Symptoms:** Application doesn't start at all, or shows "Java not found"

**Solution:**
1. Reinstall the application
2. Make sure you downloaded the complete installer (should be ~100MB+)
3. Don't install to a path with special characters or spaces

#### Issue: Corrupted Database
**Symptoms:** Backend starts but crashes immediately, database errors in log

**Solution:**
1. Close the application
2. Navigate to `%APPDATA%\myland-desktop`
3. Rename or delete `myland.db` and `myland.db.mv.db` files
4. Restart the application (it will create a fresh database)

### 3. Manual Backend Testing

To test the backend separately from Electron:

1. Open Command Prompt
2. Navigate to your project folder
3. Run: `diagnose-backend.bat`
4. Watch for error messages

This will show you exactly what's failing in the backend.

### 4. Clean Reinstall

If nothing else works:

1. Uninstall the application
2. Delete `%APPDATA%\myland-desktop` folder
3. Delete `%LOCALAPPDATA%\myland-desktop` folder
4. Restart your computer
5. Reinstall the application

### 5. Development Mode Debugging

If you're a developer:

1. Open the project in your IDE
2. Run `mvn clean package` to rebuild the JAR
3. Copy the JAR to `electron/resources/backend.jar`
4. Run `npm start` from the electron folder
5. Check the console output for detailed errors

### 6. Check System Requirements

Minimum requirements:
- Windows 10 or later (64-bit)
- 4GB RAM
- 500MB free disk space
- Administrator rights for first installation

### 7. Get Help

If you still have issues:

1. Collect the following information:
   - Windows version
   - Content of `backend.log`
   - Screenshot of the error
   - Steps to reproduce

2. Contact support with this information

## Prevention Tips

- Don't install to folders with special characters
- Keep the application updated
- Regularly backup your database from `%APPDATA%\myland-desktop\myland.db`
- Don't run multiple instances simultaneously
