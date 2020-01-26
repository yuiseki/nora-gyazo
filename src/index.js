'use strict';

// nodejsのモジュール
const path = require('path');
const fs = require('fs');

// Electronのモジュール
const electron = require("electron");
const app = electron.app;
const Tray = electron.Tray;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
ipcMain.on('update-settings', function(event) {
  console.log(settings);
});

// このアプリの各機能を実装しているモジュール
const gyazo = require('./gyazo');
const dirSyncModule = require('./module_dir_sync');
const fullScreenModule = require('./module_full_screen');


// settingsWindowはGCされないようにグローバル宣言
let settingsWindow = null;
// trayIconもGCされないようにグローバル宣言
let trayIcon = null;
// 設定データがGCされないようにグローバル宣言
let settings = null;
// 設定ファイルのパス
let settingsPath = path.join(app.getPath('userData'), "node_gyazo_settings.json");


// アプリの起動時に実行される処理
app.on('ready', function() {
  // 設定ファイルをロードする
  if(fs.existsSync(settingsPath)){
    settings =  JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  }else{
    // 設定ファイルがなかったら生成して設置する
    settings = {
      'enableDirSync': false,
      'enableFullScreen': true
    }
    fs.writeFileSync(settingsPath, JSON.stringify(settings));
  }

  // タスクトレイにアイコンを表示する
  createTray();
  // 1分おきに実行される処理を定義する
  setInterval(intervalFunction, 60000);
  intervalFunction();
});

app.on('window-all-closed', () => {

});

ipcMain.on('gyazo-upload', (event, data)=>{
  gyazo.upload(
    data.base64DataURL,
    data.content_type,
    data.file_name,
    data.title,
    data.url,
    data.desc,
    data.scale,
    data.created_at
  );
});

// 1分おきに実行する処理を実行する関数
function intervalFunction(){
  dirSyncModule.interval();
  //fullScreenModule.interval();
}


// 設定画面を表示する関数
function showSettingsWindow(){
  settingsWindow = new BrowserWindow({
    width: 1200,
    height: 1000,
    // require等nodeの機能を使うために必要
    webPreferences: {
      nodeIntegration: true
    }
  });
  // メニューバーは不要
  settingsWindow.setMenu(null);
  // ローカルファイルをロード
  settingsWindow.loadURL(`file://${__dirname}/settings.html`);
  // デバッグのために開発ツールを表示する
  settingsWindow.webContents.openDevTools();
  // 画面閉じたらnullにしとく
  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}


// タスクトレイにアイコンを表示する関数
function createTray(){
  // タスクトレイに表示するアイコンを指定（必須）
  trayIcon = new Tray('./src/images/ninja.png');
  // タスクトレイアイコンにマウスを載せたときのタイトルを指定
  trayIcon.setToolTip('Nora Gyazo');

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
  ]);
  // 右クリック時に表示するメニューをセットする
  trayIcon.setContextMenu(contextMenu);

  // タスクトレイアイコンをクリックしたときの処理
  // 右クリック時と同じにしておく
  trayIcon.on('click', () => {
    trayIcon.popUpContextMenu(contextMenu);
  });
}