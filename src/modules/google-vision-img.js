var getInfoDeDocumento = require('./analisis-info.js');
var deleteFile = require('../services/deleteFiles.js');
var ocr = require('../services/ocrFromGoogle');
// var faceService = require('../services/faceDetection');

module.exports.analisisVisionDoc = async function (archivo, arrayDocType, callback) {
  try {
    let detections = await ocr.doOCR(archivo);

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
    // deleteFile.deleteObjInServ(archivo);//borrar los archivos recibidos que se guardaron en el server
    //*************************** */
    callback(arrayDocType);
  } catch (error) {
    console.log('error en vision-img');
    console.error(error);
    let infoDeDocumento = {
      idTypeDoc: 0,
      nombre: {
        fullName: '',
        ape1: '',
        ape2: '',
        name1: '',
        name2: ''
      },
      domicilio: '',
      cp: '',
      wichOne: '',
      typeDoc: '',
      faceDetected: false
    }
    let docOjb = {
      idTypeDoc: 0,
      typeDoc: '',
      dataDoc: JSON.stringify(error),
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
}
