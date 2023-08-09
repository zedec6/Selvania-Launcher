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


const screen = electron.screen;
const display = screen.getPrimaryDisplay().workAreaSize;
let windowWidth = Math.round(display.width * 0.8);
let windowHeight = Math.round(display.height * 0.8);

if (display.width >= 1920) {
    windowWidth = 1280;
    windowHeight = 720;
} else if (display.width >= 1366) {
    windowWidth = 1024;
    windowHeight = 576;
} else {
    windowWidth = 800;
    windowHeight = 450;
}
function createWindow() {
    destroyWindow();
    mainWindow = new electron.BrowserWindow({
        title: pkg.preductname,
        width: windowWidth,
        height: windowHeight,
        minWidth: 640,
        minHeight: 560,
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