const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;

//const gyazo = require('./gyazo');

// GC対策
let invisibleWindow = null;


function interval(){
  console.log('module_full_screen: interval');

  invisibleWindow = new BrowserWindow({
    width: 0,
    height: 0,
    transparent: true,
    frame: false,
    titleBarStyle: 'hidden',
    // require等nodeの機能を使うために必要
    webPreferences: {
      nodeIntegration: true
    }
  });
  // メニューバーは不要
  invisibleWindow.setMenu(null);
  // タスクバーにアイコンを表示しない
  invisibleWindow.setSkipTaskbar(true);
  // ローカルファイルをロード
  invisibleWindow.loadURL(`file://${__dirname}/invisible.html`);
  // 画面閉じたらnullにしとく
  invisibleWindow.on('closed', () => {
    invisibleWindow = null;
  });
}

module.exports = {
  interval: interval
}