const { app, BrowserWindow } = require("electron");
let window;

function createWindow() {
  // ブラウザウインドウを作成
  window = new BrowserWindow();

  // デベロッパーツール自動起動
  // win.webContents.openDevTools();

  // index.htmlのロード
  window.loadURL(`file://${__dirname}/index.html`);

  window.on("closed", () => {
    window = null;
  });
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
  if (window === null) {
    createWindow();
  }
});
