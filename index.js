const { app, BrowserWindow } = require("electron");
require('electron-reload')(__dirname);
let win;
let dev_flg = true;

function createWindow() {
  // ブラウザウインドウを作成
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // jqueryを読み込む為に必要
      nodeIntegration: false
    }
  });
  // 閉じるイベント
  win.on("closed", () => {
    win = null;
  });
  
  if( dev_flg === true ){
    win.webContents.openDevTools();
  }

  win.webContents.loadURL(`file://${__dirname}/index.html`);
}

// Electron初期化関数(ブラウザ作成)
app.on("ready", createWindow);

// window閉じるイベント(アプリを終了する)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
