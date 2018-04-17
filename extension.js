// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const mkdirp = require('mkdirp')
const path = require('path')
const fs = require('fs-extra')

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "wxapp-helper" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('wxapp.newComponent', function () {
        // The code you place here will be executed every time your command is executed

        // 1. 打开输入框，输入基于当前文件夹的地址
        // 2. 创建文件夹，包含四个文件
        vscode.window.showInputBox({
            placeHolder: 'input component folder path base on current file'
        }).then(value => {
            // console.log('current workspace', vscode.workspace.workspaceFolders)
            const root = vscode.workspace.workspaceFolders
            if (value) {
                // 默认工作区根目录
                let currentPath = root ? root[0].uri.path : '/'
                const editor = vscode.window.activeTextEditor
                if (editor) currentPath = path.dirname(editor.document.fileName)
                // 创建文件夹，要按文件夹命名
                const uri = path.join(currentPath, value)
                const folderName = path.basename(uri)
                // console.log('current uri', uri)
                mkdirp(uri, err => {
                    if (err) throw new Error('fail to create folder: ' + uri)
                    const templatePath = path.resolve(__dirname, 'template/component')
                    // 四个文件
                    const extList = ['json', 'js', 'wxss', 'wxml']
                    // const errHandler = (e) => {
                    //     console.log(e)
                    // }
                    extList.forEach(ext => {
                        const templateFilePath = path.join(templatePath, 'component.' + ext)
                        // console.log('template file', templateFilePath)
                        const distFilePath = path.join(uri, folderName + '.' + ext)
                        // console.log('dist file', distFilePath)
                        fs.copy(templateFilePath, distFilePath)
                    })
                })
            }
        })

        // Display a message box to the user
        // vscode.window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;