const fs = require('fs');
let gm = require('gm');

const cropDir = process.cwd() + '/docs/cropImgs';
const receivedDir = process.cwd() + '/docs/docsReceived';

async function cropImage(inputFile, width, higth, xinit, yinit) {
    await gm(receivedDir + inputFile)
        .crop(width, higth, xinit, yinit)
        .write(cropDir + 'CROP' + inputFile, function (err) {
            if (err) { 
                return new Error('no se pudo recortar la imagen!')
            } else {
                console.log(this.outname + " created...");
                //TODO: guardar la imagen con los datos detectados en una base de datos
                //TODO: si ya esta guardada la imagen, se deben comparar datos y rostro para ver si ya esta almacenado dicho usuario(pensado a futuro)
                return 'CROP' + inputFile;
            }
        });
}

module.exports.cropImage = cropImage;
// cropImage = cropService.cropImage(inputFile, width, higth, xinit, yinit);
