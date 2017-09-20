const electron = require('electron');
const ipc = electron.ipcRenderer;

console.log('in renderer');

const marked = require('marked');

const $ = selector => document.querySelector(selector);

const $markdownView = $('.raw-markdown');
const $htmlView = $('.rendered-html');
const $openFileButton = $('#open-file');
const $saveFileButton = $('#save-file');
const $copyHtmlButton = $('#copy-html');

function renderMarkdownToHtml(markdown) {
  const html = marked(markdown);
  $htmlView.innerHTML = html;
}

ipc.on('file-opened', (event, file, content) => {
  console.log('renderer received file!')
  $markdownView.value = content;
  renderMarkdownToHtml(content);
});

$markdownView.addEventListener('keyup', event => {
  const content = event.target.value;
  renderMarkdownToHtml(content);
});
