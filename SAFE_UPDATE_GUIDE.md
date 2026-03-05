# Safe Update Guide - Myland Food Management System

This guide explains how to update the system to a new version without losing your existing customer records, ingredients, or production data.

## 1. Automatic Update (Recommended)

The easiest way to update is using the provided script:

1.  Navigate to the project folder (`C:\Projects\Myland02`).
2.  Double-click **`UPDATE_NOW.bat`**.
3.  Follow the prompts:
    *   It will close the running application.
    *   It will ask you to uninstall the old version (this does **not** delete your data).
    *   It will **automatically back up** your database to `%APPDATA%\myland-desktop\backups`.
    *   It will start the installer for the new version.

## 2. Manual Backup

If you want to back up your data manually at any time for safety:

*   Run the **`BACKUP_DATA.bat`** file in the project folder.
*   This creates a timestamped copy of your database in your application data folder.

## 3. Where is my data?

Your system data (database and logs) is stored in your Windows User profile:
`%APPDATA%\myland-desktop`

**Files:**
*   `myland.db`: The main database (contains all your records).
*   `backups/`: Folder containing previous database versions.
*   `backend.log`: Log file for troubleshooting.

## 4. Troubleshooting Data Issues

If you open the new version and don't see your data:

1.  **Check if you started a fresh installation**: If you moved the app to a new computer, you need to copy the `myland.db` file from the old computer's `%APPDATA%\myland-desktop` folder to the new one.
2.  **Restore from Backup**: If the database file somehow got corrupted, you can rename one of the files in the `backups/` folder to `myland.db` (make sure to back up the current one first).

> [!IMPORTANT]
> Never delete the folder at `%APPDATA%\myland-desktop` unless you want to completely reset the system and lose all customer records.
