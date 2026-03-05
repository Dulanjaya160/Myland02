const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

const fs = require('fs');

// Configuration
const BACKEND_PORT = 8080;
const BACKEND_URL = `http://127.0.0.1:${BACKEND_PORT}`;
const MAX_STARTUP_TIME = 60000; // 60 seconds max wait for backend
const HEALTH_CHECK_INTERVAL = 500; // Check every 500ms

let mainWindow = null;
let backendProcess = null;
let isQuitting = false;

/**
 * Get the path to the bundled JRE
 */
function getJrePath() {
    if (app.isPackaged) {
        // Production: JRE is bundled in resources
        return path.join(process.resourcesPath, 'jre', 'bin', 'java.exe');
    } else {
        // Development: Use system Java or bundled JRE if available
        const bundledJre = path.join(__dirname, 'resources', 'jre', 'bin', 'java.exe');
        return bundledJre;
    }
}

/**
 * Get the path to the backend JAR file
 */
function getJarPath() {
    if (app.isPackaged) {
        // Production: JAR is bundled in resources
        return path.join(process.resourcesPath, 'backend.jar');
    } else {
        // Development: JAR is in electron/resources
        return path.join(__dirname, 'resources', 'backend.jar');
    }
}

/**
 * Start the Spring Boot backend process
 */
function startBackend() {
    return new Promise((resolve, reject) => {
        const javaPath = getJrePath();
        const jarPath = getJarPath();
        const logFile = path.join(app.getPath('userData'), 'backend.log');
        const logStream = fs.createWriteStream(logFile, { flags: 'a' });

        console.log('Starting backend...');
        console.log('Java path:', javaPath);
        console.log('JAR path:', jarPath);
        console.log('Log file:', logFile);

        logStream.write(`\n--- Backend Start Attempt: ${new Date().toISOString()} ---\n`);

        // Get user data directory for database
        const userDataDir = app.getPath('userData');

        // Spawn the backend process
        backendProcess = spawn(javaPath, [
            '-Xms128m',           // Minimum heap size
            '-Xmx512m',           // Maximum heap size
            `-Duser.data.dir=${userDataDir}`,  // Pass user data directory to backend
            '-Dfile.encoding=UTF-8',
            '-jar',
            jarPath
        ], {
            cwd: userDataDir, // Run from user data directory for database
            stdio: 'pipe',
            env: {
                ...process.env,
                USER_DATA_DIR: userDataDir
            }
        });

        // Log backend output to console and file
        backendProcess.stdout.on('data', (data) => {
            const output = data.toString();
            console.log(`[Backend] ${output.trim()}`);
            logStream.write(`[STDOUT] ${output}`);
        });

        backendProcess.stderr.on('data', (data) => {
            const output = data.toString();
            console.error(`[Backend Error] ${output.trim()}`);
            logStream.write(`[STDERR] ${output}`);
        });

        backendProcess.on('error', (error) => {
            console.error('Failed to start backend:', error);
            reject(error);
        });

        backendProcess.on('exit', (code, signal) => {
            console.log(`Backend process exited with code ${code} and signal ${signal}`);
            if (!isQuitting) {
                // Backend crashed unexpectedly
                dialog.showErrorBox(
                    'Backend Error',
                    'The application backend has stopped unexpectedly. The application will now close.'
                );
                app.quit();
            }
        });

        waitForBackend(resolve, reject);
    });
}

/**
 * Check if backend is ready by polling the health endpoint
 */
function waitForBackend(resolve, reject) {
    const startTime = Date.now();
    let attemptCount = 0;

    const checkHealth = () => {
        attemptCount++;
        const healthUrl = `${BACKEND_URL}/health`;

        console.log(`[Attempt ${attemptCount}] Checking backend health at ${healthUrl}...`);

        http.get(healthUrl, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log('Backend is ready!');
                    console.log('Health check response:', data);
                    resolve();
                } else {
                    console.log(`Health check returned status ${res.statusCode}, retrying...`);
                    retryCheck();
                }
            });
        }).on('error', (error) => {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            console.log(`Health check failed after ${elapsed}s: ${error.message}`);
            retryCheck();
        });
    };

    const retryCheck = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed > MAX_STARTUP_TIME) {
            const seconds = (elapsed / 1000).toFixed(1);
            console.error(`Backend failed to start within ${seconds} seconds (${attemptCount} attempts)`);
            reject(new Error('Backend failed to start within timeout period'));
        } else {
            setTimeout(checkHealth, HEALTH_CHECK_INTERVAL);
        }
    };

    checkHealth();
}

/**
 * Stop the backend process
 */
function stopBackend() {
    if (backendProcess && !backendProcess.killed) {
        console.log('Stopping backend...');
        isQuitting = true;

        // Try graceful shutdown first
        backendProcess.kill('SIGTERM');

        // Force kill after 5 seconds if still running
        setTimeout(() => {
            if (backendProcess && !backendProcess.killed) {
                console.log('Force killing backend...');
                backendProcess.kill('SIGKILL');
            }
        }, 5000);
    }
}

/**
 * Create the main application window
 */
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1024,
        minHeight: 768,
        icon: path.join(__dirname, 'icon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            devTools: true // Enable dev tools for debugging blank page
        },
        show: false
    });

    // Handle load failure
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
        console.error(`Page failed to load! URL: ${validatedURL}, Error: ${errorDescription} (${errorCode})`);

        const logFile = path.join(app.getPath('userData'), 'backend.log');
        fs.appendFileSync(logFile, `[MAIN ERROR] Page failed to load! Error: ${errorDescription} (${errorCode})\n`);

        if (validatedURL === BACKEND_URL) {
            dialog.showErrorBox(
                'Connection Error',
                `Failed to load the application UI. The backend may be running but is not reachable.\n\nError: ${errorDescription} (${errorCode})`
            );
        }
    });

    // Handle initial load completion
    mainWindow.webContents.on('did-finish-load', () => {
        console.log('Page finished loading.');
    });

    // Load the application
    console.log(`Loading URL: ${BACKEND_URL}`);
    mainWindow.loadURL(BACKEND_URL);

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        // Automatically open DevTools if it's blank or for debugging
        if (process.env.DEBUG || true) {
            mainWindow.webContents.openDevTools();
        }
    });

    // Handle window close
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Prevent navigation away from the app
    mainWindow.webContents.on('will-navigate', (event, url) => {
        if (!url.startsWith(BACKEND_URL)) {
            event.preventDefault();
        }
    });

    // Prevent new windows
    mainWindow.webContents.setWindowOpenHandler(() => {
        return { action: 'deny' };
    });
}

/**
 * Application initialization
 */
async function initialize() {
    try {
        // Start the backend
        await startBackend();

        // Create the window
        createWindow();
    } catch (error) {
        console.error('Initialization failed:', error);
        dialog.showErrorBox(
            'Startup Error',
            `Failed to start the application: ${error.message}\n\nPlease try again or contact support.`
        );
        app.quit();
    }
}

// Single instance lock - prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    // Another instance is already running
    app.quit();
} else {
    // This is the first instance
    app.on('second-instance', () => {
        // Someone tried to run a second instance, focus our window
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.focus();
        }
    });

    // App lifecycle events
    app.whenReady().then(initialize);

    app.on('window-all-closed', () => {
        // On Windows, quit when all windows are closed
        stopBackend();
        app.quit();
    });

    app.on('before-quit', () => {
        isQuitting = true;
        stopBackend();
    });

    app.on('activate', () => {
        // On macOS, re-create window when dock icon is clicked
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    // Native Printing Handler
    ipcMain.on('print-document', (event, htmlContent) => {
        console.log('Received print request from frontend');

        // Create a hidden window for printing
        let printWindow = new BrowserWindow({
            show: false,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true
            }
        });

        // Load the HTML content directly via Data URI
        // This is much more reliable in Electron than blob URLs or iframes
        const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
        printWindow.loadURL(dataUrl);

        printWindow.webContents.on('did-finish-load', () => {
            console.log('Print window loaded, executing print...');
            // Add a small delay for any CSS to apply completely
            setTimeout(() => {
                printWindow.webContents.print({
                    silent: false,
                    printBackground: true,
                    color: true
                }, (success, failureReason) => {
                    if (!success) {
                        console.error('Print failed:', failureReason);
                    } else {
                        console.log('Print completed successfully');
                    }
                    printWindow.close();
                });
            }, 500);
        });

        printWindow.on('closed', () => {
            printWindow = null;
        });
    });
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    stopBackend();
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled rejection at:', promise, 'reason:', reason);
});
