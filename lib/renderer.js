const electron = require('electron');
const ipc = electron.ipcRenderer;

const marked = require('marked');

const $ = selector => document.querySelector(selector);

const $markdownView = $('.raw-markdown');
const $htmlView = $('.rendered-html');
const $openFileButton = $('#open-file');
const $saveFileButton = $('#save-file');
const $copyHtmlButton = $('#copy-html');

app.on('ready', () => {
  mainWindow.webContents.openDevTools();
});

ipc.on('file-opened', (event, file, content) => {
  $markdownView.value = content;
  renderMarkdownToHtml(content);
});

function renderMarkdownToHtml(markdown) {
  const html = marked(markdown);
  $htmlView.innerHTML = html;
}
