const fs = require('fs');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

//borrar un archivo en google store
module.exports.deleteObject = function (fileName, bucketName) {
  storage.bucket(bucketName).file(fileName).delete();
  console.log(fileName + ' borrado de google storage!');
};

//borrar todos los archivos
module.exports.deleteAllObjInServ = async function (serverFiles) {
  console.log(serverFiles);
  serverFiles.forEach(function (fileName) {
    fs.unlink('./docs/docsReceived/' + fileName, function (err) {
      if (err) throw err;

      console.log('Archivo ' + fileName + ' borrado localmente!');
    });
  });
};

//borrar un archivo
module.exports.deleteObjInServ = (fileName) => {
  fs.unlink('./docs/docsReceived/' + fileName, function (err) {
    if (err) throw err;
    console.log('Archivo ' + fileName + ' borrado localmente!');
  });
};

module.exports.deleteJsonInServ = (fileName) => {
  fs.unlink('./docs/jsonResults/' + fileName, function (err) {
    if (err) throw err;
    console.log('Archivo ' + fileName + ' borrado localmente!');
  });
};
