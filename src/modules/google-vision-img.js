const fs = require('fs');
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
var getInfoDeDocumento = require('./analisis-info.js');
var deleteFile = require('../services/deleteFiles.js');
var ocr = require('../services/ocrFromGoogle');

let flagItem = 0;

module.exports.analisisVisionDoc = async function(archivo, arrayDocType, callback){
  var rostro, facedetection;

  let detections = await ocr.doOCR(archivo);

  rostro = true; //prueba

  let infoDeDocumento = await getInfoDeDocumento.getInfoDeDocumento(archivo, detections, rostro); //identificar el tipo de doc

  let idDoc = infoDeDocumento.idTypeDoc;
  let tipoDeDocumento = infoDeDocumento.wichOne;

  let docOjb = {
    idTypeDoc: idDoc,
    typeDoc: tipoDeDocumento,
    dataDoc: detections[0].description,
    dataAnalized: infoDeDocumento
  };

  docOjb.numDoc = 1;
  arrayDocType.data.push(docOjb);

  // deleteFile.deleteAllObjInGS(arrNames);//borrar archivos en google storage cuando ya no sea requerido
  deleteFile.deleteObjInServ(archivo);//borrar los archivos recibidos que se guardaron en el server
  callback(arrayDocType);
}
