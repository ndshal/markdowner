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

ipc.on('file-opened', (event, file, content) => {
  console.log('renderer received file!')
  $markdownView.value = content;
  renderMarkdownToHtml(content);
});

function renderMarkdownToHtml(markdown) {
  const html = marked(markdown);
  $htmlView.innerHTML = html;
}
