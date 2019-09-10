const fs = require('fs');
let gm = require('gm');

const cropDir = process.cwd() + '/docs/cropImgs';
const ReceivedDir = process.cwd() + '/docs/docsReceived';

async function cropImage(inputFile,width,higth,xinit,yinit) {

    await gm(ReceivedDir + inputFile)
        .crop(width, higth, xinit, yinit)
        .write(cropDir + inputFile, function(err){
            if (err) return console.dir(arguments)
            console.log(this.outname + " created...");
        });
}

module.exports.cropImage = cropImage;