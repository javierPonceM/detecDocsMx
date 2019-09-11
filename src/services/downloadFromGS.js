const config = require("config");
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const storage = new Storage();

const jsonResultsDir = config.get("dirs.jsonResultsDir");

module.exports.fileDownload = async function (archivo, bucket, callback) {
  const myBucket = storage.bucket(bucket);
  let destArchivo = jsonResultsDir + archivo;
  const file = myBucket.file(archivo);

  file.download().then(function (data) {
    const contents = data[0];
    fs.writeFile(destArchivo, contents, (err) => { //se guarda el archivo en el server
      if (err) throw err;
      // console.log(contents);
      callback(destArchivo);
    });
  }).catch(function (err) {
    if (err) {
      console.log(err);
      throw err;
    }
  });
};
