const electron = require("electron");
const app = electron.app;

const path = require('path');
const fs = require('fs');
const request = require('request');

// device_idは一回読み込めばいいのでグローバルで宣言する
let device_id = null;

function upload(base64DataURL, content_type, file_name, title, url, desc, scale, created_at){
  const imagedata = new Buffer(base64DataURL, 'base64');
  
  if (device_id === null) {
    let device_id_path = null;
    let pf = process.platform
    switch (pf) {
      case 'win32':
        device_id_path = path.join(app.getPath('appData'), 'Gyazo', 'id.txt');
        break;
      case 'darwin':
        device_id_path = path.join(app.getPath('home'), 'Library', 'Gyazo', 'id');
        break;
      case 'linux':
        device_id_path = path.join(app.getPath('home'), '.gyazo.id');
        break;
    }
    device_id = fs.readFileSync(device_id_path, 'utf8');
  }
  console.log('gyazo device id: ' + device_id);

  // Gyazoにアップロードするための multipart/form-data をつくる
  const metadata = {
    app: "nora-gyazo",
    title: title,
    url: url,
    desc: desc
  };

  const formData = {
    id: device_id,
    scale: scale,
    created_at: created_at,
    metadata: JSON.stringify(metadata),
    imagedata: {
      value: imagedata,
      options: {
        filename: file_name,
        contentType: content_type
      }
    }
  };

  console.log('form data: ');
  console.log(formData);

  request.post({url:'https://upload.gyazo.com/upload.cgi', formData: formData}, function optionalCallback(err, httpResponse, body) {
    console.log(httpResponse.statusCode);
    console.log(httpResponse.body);
  });
}

module.exports = {
  upload: upload
};