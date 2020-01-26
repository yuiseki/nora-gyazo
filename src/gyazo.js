const electron = require("electron");
const app = electron.app;

const path = require('path');
const fs = require('fs');

const axios = require('axios');
const FormData = require('form-data');

// device_idは一回読み込めばいいのでグローバルで宣言する
let device_id = null;

function upload(base64DataURL, content_type, file_name, title, url, desc, scale, created_at){
  const imagedata = Buffer.from(base64DataURL, 'base64');
  console.log('gyazo upload: '+imagedata.length+' bytes');
  if(device_id === null){
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

  let formData = new FormData();
  formData.append("id", device_id);
  formData.append("scale", scale);
  formData.append("created_at", created_at);
  formData.append("metadata", JSON.stringify(metadata));
  formData.append("imagedata", imagedata, {
    filename: file_name,
    contentType: content_type,
    knownLength: imagedata.length
  });
  res = axios.post('https://upload.gyazo.com/upload.cgi', formData, {
    headers: formData.getHeaders()
  }).catch(error => {
    const {
      status,
      statusText
    } = error.response;
    console.log(`Gyazo Upload Error! HTTP Status: ${status} ${statusText}`);
  });
}

module.exports = {
  upload: upload
};