/**
 * Preload script for Electron
 * This script runs in the renderer process before web content loads
 * It provides a secure bridge between the renderer and main process
 */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    print: (content) => ipcRenderer.send('print-document', content)
});

console.log('Preload script loaded with native printing capabilities');
