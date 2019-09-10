var getInfoDeDocumento = require('./analisis-info.js');
var deleteFile = require('../services/deleteFiles.js');
var ocr = require('../services/ocrFromGoogle');
// var faceService = require('../services/faceDetection');

module.exports.analisisVisionDoc = async function(archivo, arrayDocType, callback){
  var rostro, facedetection;

  let detections = await ocr.doOCR(archivo);

  // let faces = await faceService.detectFaces(archivo);
  // rostro = faces ? true : false;

  let infoDeDocumento = await getInfoDeDocumento.getInfoDeDocumento(archivo, detections); //identificar el tipo de doc

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

//************************************** */
  //comete la siguiente linea si no quiere tener problemas con el modulo de face detection
  deleteFile.deleteObjInServ(archivo);//borrar los archivos recibidos que se guardaron en el server
  //*************************** */
  callback(arrayDocType);
}
