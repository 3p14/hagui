const mdns = require('mdns');
const {
    app,
    BrowserWindow
} = require('electron');
const crypto = require('crypto');

let mainWindow = null;
let mdnsBrowser = null;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        show: false
    });
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        mdnsBrowser = mdns.createBrowser(mdns.tcp('home-assistant'));
        mdnsBrowser.on('serviceUp', (service) => {
            let hash = crypto.createHash('md5');
            service.hash = hash.update(service.fullname).digest('hex');
            console.log(mainWindow.webContents.send('serviceUp', service));
        });
        mdnsBrowser.on('serviceDown', (service) => {
            console.log("Service Down: ", service);
        });
        mdnsBrowser.start();
    });
});