const fs = require('fs');
const path = require('path');

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const dialog = electron.dialog;
const Menu = electron.Menu;

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

  const file = files[0];
  const content = fs.readFileSync(file).toString();

  app.addRecentDocument(file);
  mainWindow.webContents.send('file-opened', file, content);
}

function saveFile(content) {
  const fileName = dialog.showSaveDialog(mainWindow, {
    title: 'Save HTML Output',
    defaultPath: app.getPath('documents'),
    filters: [
      { name: 'HTML Files', extensions: ['html'] }
    ]
  });

  if (!fileName) return;

  fs.writeFileSync(fileName, content);
}

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: 'hidden'
  });
  mainWindow.loadURL('file://' + path.join(__dirname, 'index.html'));

  mainWindow.webContents.openDevTools();
  mainWindow.webContents.on('did-finish-load', openFile);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});

app.on('open-file', (event, file) => {
  const content = fs.readFileSync(file).toString();
  mainWindow.webContents.send('file-opened', file, content);
})

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open...',
        accelerator: 'CmdOrCtrl+O',
        click () { openFile() }
      },
      {
        label: 'Save...',
        accelerator: 'CmdOrCtrl+S',
        click () {
          // We can't call saveFile(content) directly because we need to get
          // the content from the renderer process. So, send a message to the
          // renderer, telling it we want to save the file.
          mainWindow.webContents.send('save-file')
        }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      }
    ]
  },
  {
    label: 'Developer',
    submenu: [
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin'
          ? 'Alt+Command+I'
          : 'Ctrl+Shift+I',
        click () { mainWindow.webContents.toggleDevTools() }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  const name = app.getName()
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        label: 'Services',
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide ' + name,
        accelerator: 'Command+H',
        role: 'hide'
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers'
      },
      {
        label: 'Show All',
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click () { app.quit() }
      }
    ]
  })
}

exports.openFile = openFile;
exports.saveFile = saveFile;
