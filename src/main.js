const { app, BrowserWindow } = require('electron');

var win;

function createWindow() {
    win = new BrowserWindow({
        width: 800 + 410,
        height: 770,
        resizable: false,
        fullscreen: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadFile(`${__dirname}/index.html`);
    win.setMenu(null);
    win.setMenuBarVisibility(false);
    win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
