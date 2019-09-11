const config = require("config");
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
const fs = require('fs');
let gm = require('gm');
const cropService = require('./cropImages');

const receivedDir = config.get("dirs.receivedDir");
const jsonResultsDir = config.get("dirs.jsonResultsDir");

async function detectFaces(inputFile) {
  let faceCoordenates = {};
  const request = { image: { source: { filename: receivedDir + inputFile } } };
  const results = await client.faceDetection(request);
  const faces = results[0].faceAnnotations;
  const numFaces = faces.length;
  console.log(`Found ${numFaces} face${numFaces === 1 ? '' : 's'}.`);
  if (numFaces != 0) {  //checar el caso de una imagen con mas rostros.
    //recortar el rostro de la imagen si es que lo hay
    let width = faces[0].boundingPoly.vertices[1].x - faces[0].boundingPoly.vertices[0].x;
    let higth = faces[0].boundingPoly.vertices[2].y - faces[0].boundingPoly.vertices[1].y;
    let xinit = faces[0].boundingPoly.vertices[0].x;
    let yinit = faces[0].boundingPoly.vertices[0].y;
    faceCoordenates = {
      face: [{
        width: width,
        higth: higth,
        xinit: xinit,
        yinit: yinit
      }
      ]
    };
  }
  return faceCoordenates;
}

//solo para sacar los datos de las posiciones de los json
let writeFileJson = async (nameFile, datos) => {//este debe ser un modulo aparte
  await fs.writeFile(jsonResultsDir + nameFile + '.json', JSON.stringify(datos), (err) => { //se guarda el archivo en el server
    if (err) throw err;
    console.log('json guardado!');
  });
}


module.exports.detectFaces = detectFaces;