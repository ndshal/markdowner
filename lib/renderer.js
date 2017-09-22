const electron = require('electron');
const ipc = electron.ipcRenderer;
const remote = electron.remote;

const marked = require('marked');

const $ = selector => document.querySelector(selector);

const $markdownView = $('.raw-markdown');
const $htmlView = $('.rendered-html');
const $openFileButton = $('#open-file');
const $saveFileButton = $('#save-file');
const $copyHtmlButton = $('#copy-html');

const mainProcess = remote.require('./main');
const clipboard = remote.clipboard;

function renderMarkdownToHtml(markdown) {
  const html = marked(markdown);
  $htmlView.innerHTML = html;
}

ipc.on('file-opened', (event, file, content) => {
  console.log('renderer received file!')
  $markdownView.value = content;
  renderMarkdownToHtml(content);
});

ipc.on('save-file', event => {
  const html = $htmlView.innerHTML;
  mainProcess.saveFile(html);
})

$markdownView.addEventListener('keyup', event => {
  const content = event.target.value;
  renderMarkdownToHtml(content);
});

$openFileButton.addEventListener('click', () => {
  mainProcess.openFile();
});

$copyHtmlButton.addEventListener('click', () => {
  const html = $htmlView.innerHTML;
  clipboard.writeText(html);
});

$saveFileButton.addEventListener('click', () => {
  const html = $htmlView.innerHTML;
  mainProcess.saveFile(html);
});
