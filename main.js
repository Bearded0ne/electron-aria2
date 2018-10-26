// Entry point of the program to be called with electron 

const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const { exec, spawn } = require('child_process')
const psTree = require('ps-tree')
var ariaProc

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  // mainWindow = new BrowserWindow({titleBarStyle: "hidden", width: 800, height: 600, minWidth: 320})
  mainWindow = new BrowserWindow({width: 800, height: 600, minWidth: 360, minHeight: 400})

  // disable menu bar
  mainWindow.setMenuBarVisibility(false)

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
  scriptName = process.platform === 'win32' ? 'aria2.bat' : 'aria2.sh'
  ariaProc = exec(
    path.join(__dirname, scriptName),
    (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return
    }
    console.log(`stdout: ${stdout}`)
    console.log(`stderr: ${stderr}`)
  })
})

app.on('before-quit', () => {
  // kill aria2 process, ariaProc.kill() fdoes not work
  // because it only kills the sh process
  psTree(ariaProc.pid, (_err, children) => {
    const pids = children.map((p) => p.PID)
    if (process.platform === 'win32') {
      spawn('Taskkill', ['/PID'].concat(pids))
    } else {
      spawn('kill', ['-9'].concat(pids))
    }
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
