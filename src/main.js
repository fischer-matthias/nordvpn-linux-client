
var app = require('app');
var BrowserWindow = require('browser-window');

require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function () {

    mainWindow = new BrowserWindow({
        width: 800,// + 410,
        height: 770,
        resizable: false,
        fullscreen: false,
        webPreferences: { webSecurity: false }
    });

    mainWindow.loadUrl('file://' + __dirname + '/index.html');
    mainWindow.setMenu(null);
    // mainWindow.openDevTools();    // requires a width 410px 

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});

