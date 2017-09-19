const fs = require('fs');
const path = require('path');

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const dialog = electron.dialog;

let mainWindow = null;

function openFile() {
  const files = dialog.showOpenDialog(mainWindow, {
    buttonLabel: 'Select File',
    properties: ['openFile'],
    filters: [
      { name: 'Markdown Files', extensions: ['md', 'markdown', 'txt'] }
    ]
  });

  if (!files) return;

  console.log(typeof(files[0]));

  const file = files[0];
  const content = fs.readFileSync(file).toString();

  mainWindow.webContents.send('file-opened', file, content);
}

app.on('ready', () => {
  console.log('The application is ready');

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: 'hidden'
  });
  mainWindow.loadURL('file://' + path.join(__dirname, 'index.html'));

  mainWindow.webContents.on('did-finish-load', openFile);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
