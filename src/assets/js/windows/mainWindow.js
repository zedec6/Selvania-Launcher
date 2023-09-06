/**
 * @author Luuxis
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0/
 */

"use strict";
const electron = require("electron");
const path = require("path");
const os = require("os");
const pkg = require("../../../../package.json");
let mainWindow = undefined;

function getWindow() {
    return mainWindow;
}

function destroyWindow() {
    if (!mainWindow) return;
    mainWindow.close();
    mainWindow = undefined;
}

function createWindow() {
    destroyWindow();

    const { screen } = electron;
    const primaryDisplay = screen.getPrimaryDisplay();
    const screenWidth = primaryDisplay.workAreaSize.width;
    const screenHeight = primaryDisplay.workAreaSize.height;

    // Defina as dimensões da janela com base na proporção desejada
    const aspectRatio = 16 / 9; // Por exemplo, uma proporção 16:9
    const windowWidth = Math.min(screenWidth * 0.8, 1920); // Largura máxima de 1920 pixels ou 80% da largura do monitor
    const windowHeight = windowWidth / aspectRatio;

    mainWindow = new electron.BrowserWindow({
        title: pkg.productName,
        width: windowWidth,
        height: windowHeight,
        minWidth: 640,
        minHeight: 360, // Mantenha uma proporção 16:9 com altura mínima
        resizable: true,
        icon: `./src/assets/images/icone.${os.platform() === "win32" ? "ico" : "png"}`,
        transparent: os.platform() === 'win32',
        frame: os.platform() !== 'win32',
        show: false,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        },
    });

    electron.Menu.setApplicationMenu(null);
    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadFile(path.join(electron.app.getAppPath(), 'src', 'launcher.html'));
    
    mainWindow.once('ready-to-show', () => {
        if (mainWindow) {
            mainWindow.show();
        }
    });
}
module.exports = {
    getWindow,
    createWindow,
    destroyWindow,
};