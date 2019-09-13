const config = require("config");
const fs = require('fs');
const gm = require('gm');
const cropDir = config.get("dirs.cropDir");
const receivedDir = config.get("dirs.receivedDir");

function cropImage(inputFile, width, higth, xinit, yinit) {
    let cropImg = 'CROP' + inputFile;
    return new Promise((resolve,reject)=>{
        gm(receivedDir + inputFile)
            .crop(width, higth, xinit, yinit)
            .write(cropDir + cropImg , function (err) {
                if (err) {
                    console.log(err);
                    reject(false);
                } else {
                    console.log(cropImg + " created...");
                    resolve(cropImg);
                    //TODO: si ya esta guardada la imagen, se deben comparar datos y rostro para ver si ya esta almacenado dicho usuario(pensado a futuro)
                }
            });
    });
}

module.exports.cropImage = cropImage;
// cropImage = cropService.cropImage(inputFile, width, higth, xinit, yinit);
