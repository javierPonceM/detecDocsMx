const fs = require('fs');
const gm = require('gm');

const cropDir = process.cwd() + '/docs/cropImgs/';
const receivedDir = process.cwd() + '/docs/docsReceived/';

function cropImage(inputFile, width, higth, xinit, yinit) {
    gm(receivedDir + inputFile)
        .crop(width, higth, xinit, yinit)
        .write(cropDir + 'CROP' + inputFile, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log(this.outname + " created...");
                //TODO: guardar la imagen con los datos detectados en una base de datos
                //TODO: si ya esta guardada la imagen, se deben comparar datos y rostro para ver si ya esta almacenado dicho usuario(pensado a futuro)
            }
        });
        return 'CROP' + inputFile;
}

module.exports.cropImage = cropImage;
// cropImage = cropService.cropImage(inputFile, width, higth, xinit, yinit);
