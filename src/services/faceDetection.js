const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
const fs = require('fs');
let gm = require('gm');

const cropDir = process.cwd() + '/docs/cropImgs/';
const receivedDir = process.cwd() + '/docs/docsReceived/';

async function detectFaces(inputFile) {
    const request = { image: { source: { filename: receivedDir +inputFile } } };
    const results = await client.faceDetection(request);
    const faces = results[0].faceAnnotations;
    const numFaces = faces.length;
    console.log(`Found ${numFaces} face${numFaces === 1 ? '' : 's'}.`);
    if (numFaces != 0) {//checar el caso de una imagen con mas rostros.
        //recortar el rostro de la imagen si es que lo hay
        let width = faces[0].boundingPoly.vertices[1].x - faces[0].boundingPoly.vertices[0].x;
        let higth = faces[0].boundingPoly.vertices[2].y - faces[0].boundingPoly.vertices[1].y;
        let xinit = faces[0].boundingPoly.vertices[0].x;
        let yinit = faces[0].boundingPoly.vertices[0].y;
        
        await gm(inputFile)
          .crop(width, higth, xinit, yinit)
          .write(cropDir + 'CROP' + inputFile, function(err){
            if (err) return console.dir(arguments)
            console.log(this.outname + " created...");
            //TODO: guardar la imagen con los datos detectados en una base de datos
            //TODO: si ya esta guardada la imagen, se deben comparar datos y rostro para ver si ya esta almacenado dicho usuario(pensado a futuro)
          }
        );
    }
    return faces;
}

//solo para sacar los datos de las posiciones de los json
let writeFileJson = async (nameFile, datos) => {//este debe ser un modulo aparte
    await fs.writeFile(nameFile + '.json', JSON.stringify(datos), (err) => { //se guarda el archivo en el server
        if (err) throw err;
        console.log('json guardado!');
    });
}


module.exports.detectFaces = detectFaces;