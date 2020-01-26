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
const remote = electron.remote;
const ipcMain = electron.ipcMain;
ipcMain.on('update-settings', function(event) {
  console.log(settings);
});

const dirSyncModule = require('./module_dir_sync');
const fullScreenModule = require('./module_full_screen');

// settingsWindowはGCされないようにグローバル宣言
let settingsWindow;
// trayIconもGCされないようにグローバル宣言
let trayIcon = null;


// 設定ファイルのパス
let settingsPath = path.join(app.getPath('userData'), "settings.json");
// 設定データがGCされないようにグローバル宣言
let settings;


// 起動時に実行される処理
app.on('ready', function() {
  // 設定ファイルをロードする
  if(fs.existsSync(settingsPath)){
    settings =  JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  }else{
    // 設定ファイルがなかったら生成して設置する
    settings = {
      'enableDirSync': false,
      'enableFullScreen': false
    }
    fs.writeFileSync(settingsPath, JSON.stringify(settings));
  }
  remote.getGlobal('settings');
  // タスクトレイにアイコンを表示する
  createTray();
  // 1分おきに実行される処理を定義する
  setInterval(intervalFunction, 60000);
});

// 1分おきに実行する処理を実装する関数
function intervalFunction(){
  if(settings.enableDirSync){
    dirSyncModule.interval();
  }
  if(settings.enableFullScreen){
    fullScreenModule.interval();
  }
}

// 設定画面を表示する関数
function showSettingsWindow(){
  settingsWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  settingsWindow.setMenu(null);
  // ローカルファイルをロード
  settingsWindow.loadURL(`file://${__dirname}/public/settings.html`);
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
  trayIcon = new Tray('./public/images/ninja.png');
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
  // 右クリック時に表示するメニューをセット
  trayIcon.setContextMenu(contextMenu);

  // タスクトレイアイコンをクリックしたときの処理
  // 右クリック時と同じにしておく
  trayIcon.on('click', () => {
    trayIcon.popUpContextMenu(contextMenu);
  });
}