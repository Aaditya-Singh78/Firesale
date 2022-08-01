const marked = require('marked');
const {remote, ipcRenderer} = require('electron');
const mainProcesses = remote.require('./main');
const currwin = remote.getCurrentwindow();
const path = require('path');
const { title } = require('process');

let filePath = null;
let originalContent = '';
let isEdited = false; 

const UpdateUserInterface = () =>{
   let title = 'FireSale';
   if(filePath){
    title = `${path.basename(filePath)} - ${title}`;
   }
   currwin.setTitle(title);
};

const markdownView = document.getElementById('markdown');
const htmlView = document.querySelector('#html');
const newFileButton = document.querySelector('#new-file');
const openFileButton = document.querySelector('#open-file');
const saveMarkdownButton = document.querySelector('#save-markdown');
const revertButton = document.querySelector('#revert');
const saveHtmlButton = document.querySelector('#save-html');
const showFileButton = document.querySelector('#show-file');
const openInDefaultButton = document.querySelector('#open-in-default');

const renderMarkdownToHtml = markdown => {
    htmlView.innerHTML = marked(markdown, { sanitize: true });
};

markdownView.addEventListener('keyup', event => {
    let currentContent = event.target.value;
    renderMarkdownToHtml(currentContent);
    isEdited = currentContent !== originalContent;
    if(isEdited){
        title = `${title}*`;
    }
    saveMarkdownButton.ariaDisabled = !isEdited;
    revertButton.ariaDisabled = !isEdited
    UpdateUserInterface();
});

saveMarkdownButton.addEventListener('click',()=>{
  mainProcesses.saveMarkdown(filePath,markdownView.value);
});

openFileButton.addEventListener('click',()=>{
    mainProcesses.getFileFromUser();
});

ipcRenderer.on('file-opened',(event,file,content)=>{
    filePath = file;
    originalContent = content;
    markdownView.value = content;
    renderMarkdownToHtml(content);
    UpdateUserInterface();
});