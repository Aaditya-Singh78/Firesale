const fs = require('fs');
const { app, BrowserWindow, dialog } = require('electron');
let win = null;
app.on('ready',()=>{
    console.log("The Application is Ready");
     win = new BrowserWindow({show: false});
     win.loadFile(`${__dirname}/index.html`);
    //  getFilefromUser();
     win.once('ready-to-show',()=>{
        win.show();
     })
});
console.log("Starting up...");
const getFilefromUser = () =>{
    const files = dialog.showOpenDialog({
        properties: ['openFile'],
        buttonLabel: 'unveil',
        filters: [
            {name: 'Text Files', extensions: ['txt', 'text']},
            {name: 'markdown', extensions: ['md','mdown', 'markdown', 'marcdown']}
        ]
    });
    if(!files) return; 
    const file = files[0];
    openFile(file);
};

exports.saveMarkdown = (file,content) =>{
    fs.writeFileSync(file,content);
};



const openFile = file =>{
    const content = fs.readFileSync(file).toString();
    app.addRecentDocument(file);
    win.webContents.send('file-opened',file, content);
};