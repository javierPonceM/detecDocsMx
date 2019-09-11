const config = require("config");
const fs = require('fs');
const {
  Storage
} = require('@google-cloud/storage');
const toDoPublic = require('./makeDocPublic.js');
const storage = new Storage();

const receivedDir = config.get("dirs.receivedDir");

module.exports.upload2Google = async function(archivo, mime, bucket, callbackUpload) {
  let myBucket = storage.bucket(bucket);
  let file = myBucket.file(archivo);
  fs.createReadStream(receivedDir + archivo)
    .pipe(file.createWriteStream({
      metadata: {
        contentType: mime,
        metadata: {
          custom: 'metadata'
        }
      }
    }))
    .on('error', function(err) {
      console.log('error al subir archivo' + JSON.stringify(err));
      callbackUpload(true, err);
    })
    .on('finish', function() {
      console.log('se termino de leer y subir el archivo');
      toDoPublic.makeDocPublic(archivo, bucket); //hacer publico el documento para su analisis desde el api de google vision
      callbackUpload(false, archivo);
    });
}
