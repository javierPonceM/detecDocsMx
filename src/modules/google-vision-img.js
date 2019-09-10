const fs = require('fs');
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
var getInfoDeDocumento = require('./analisis-info.js');
var deleteFile = require('../services/deleteFiles.js');
let faceService = require('./faceDetection/faceDetection');
let flagItem = 0;

module.exports.analisisVisionDoc = async function (archivo, mime, nombreBucket, arrayDocType, callback) {
  let bucketName = nombreBucket;
  let rostro, facedetection, rostroDetectado, resultado;

  let filePath = process.cwd() +'/docs/docsReceived/' + archivo;


  const [resultados] = await client.textDetection(filePath);
  const detections = resultados.textAnnotations;

  const respVision = detections[0].description;

  
  let faces = await faceService.detectFaces(filePath);
  rostro = faces ? true : false;
  // rostro = true; //prueba
  // resultado.pages.blocks[i].paragraphs[k].words[j].symbols[h].confidence >0.75;
  // resultado.pages.blocks[i].paragraphs[k].words[j].symbols[h].text
  let infoDeDocumento = await getInfoDeDocumento.getInfoDeDocumento(respVision, rostro); //identificar el tipo de doc
  

  let idDoc = infoDeDocumento.idTypeDoc;
  let tipoDeDocumento = infoDeDocumento.wichOne;

  let docOjb = {
    idTypeDoc: idDoc,
    typeDoc: tipoDeDocumento,
    dataDoc: respVision,
    dataAnalized: infoDeDocumento
  };

  docOjb.numDoc = 1;
  arrayDocType.data.push(docOjb);

  


//************************************** */
  //comete la siguiente linea si no quiere tener problemas con el modulo de face detection
  deleteFile.deleteObjInServ(archivo);//borrar los archivos recibidos que se guardaron en el server
  //*************************** */
  callback(arrayDocType);
}
