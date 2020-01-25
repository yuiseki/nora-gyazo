'use strict';

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
});


// 通知領域を実装する関数
function createTray(){
  // 通知領域に表示するアイコンを指定（必須）
  tray = new Tray('./public/images/ninja.png');

  // 通知領域をクリックした際のメニュー
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '設定',
      click (menuItem){
        settingsWindow()
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
  // メニューを設定
  tray.setContextMenu(contextMenu)

  // 通知領域のアイコンにマウスを載せたときのタイトル
  tray.setToolTip('Nora Gyazo')
  tray.on('click', () => {
    tray.popUpContextMenu(contextMenu)
  })
}