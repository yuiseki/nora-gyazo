'use strict';
// nodejsのモジュール
const path = require('path');
// Electronのモジュール
const electron = require("electron");
const Tray = electron.Tray;
const Menu = electron.Menu;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

// settingsWindowはGCされないようにグローバル宣言
let settingsWindow;
// trayもGCされないようにグローバル宣言
let tray = null;

// 起動時に実行される処理
app.on('ready', function() {
  createTray();
  // 1分おきに実行される処理を定義する
  setInterval(intervalFunction, 60000);
});

// 1分おきに実行する処理を実装する関数
// TODO 設定ファイルを見て実行するかどうかをきめるべき
function intervalFunction(){
  uploadFullScreenCapture();
  uploadDownloadDir();
}

// 全画面をキャプチャしてGyazoにアップロードする関数
// TODO 未実装
function uploadFullScreenCapture(){

}

// ダウンロードフォルダ内の画像をすべてGyazoにアップロードする関数
// TODO 未実装
function uploadDownloadDir(){

}

// 設定画面を表示する関数
function showSettingsWindow(){
  let settingsWindow = new BrowserWindow({ width: 800, height: 600 })
  settingsWindow.on('closed', () => {
    settingsWindow = null
  })
  // ローカルファイルをロード
  settingsWindow.loadURL(`file://${__dirname}/public/settings.html`)
}


// タスクトレイにアイコンを表示する関数
function createTray(){
  // タスクトレイに表示するアイコンを指定（必須）
  tray = new Tray('./public/images/ninja.png');
  // タスクトレイアイコンにマウスを載せたときのタイトルを指定
  tray.setToolTip('Nora Gyazo')

  // タスクトレイアイコンを右クリックした際のメニューを定義する
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '設定',
      click (menuItem){
        showSettingsWindow();
      }
    },
    {
      type: 'separator'
    },
    {
      label: '終了',
      click (menuItem){
        app.quit();
      }
    }
  ])
  // 右クリック時に表示するメニューをセット
  tray.setContextMenu(contextMenu);

  // タスクトレイアイコンをクリックしたときの処理
  // 右クリック時と同じにしておく
  tray.on('click', () => {
    tray.popUpContextMenu(contextMenu);
  });
}