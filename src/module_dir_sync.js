const electron = require("electron");
const app = electron.app;

const gyazo = require('./gyazo');

function interval(){
  console.log('module_dir_sync: interval');
  console.log(app.getPath('downloads'));
}

module.exports = {
  interval: interval
}