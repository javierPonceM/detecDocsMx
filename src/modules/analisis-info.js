var ine = require('./docsAnalysis/INE.js'),
  cfe = require('./docsAnalysis/recibo-cfe.js'),
  telmex = require('./docsAnalysis/recibo-telmex.js'),
  axtel = require('./docsAnalysis/recibo-axtel.js'),
  passMx = require('./docsAnalysis/pasaporte-mx.js'),
  formMigrtMx = require('./docsAnalysis/form-migrt-mx.js'),
  dni = require('./docsAnalysis/DNI.js'),
  licDeCondCdmxs = require('./docsAnalysis/licencia-manejo-cdmx.js'),
  reciboAguaCdmx = require('./docsAnalysis/recibo-agua-cdmx.js'),
  reciboPredialCdmx = require('./docsAnalysis/recibo-predial-cdmx.js');


module.exports.getInfoDeDocumento = async (archivo, respVision) => {
  let rostro = true; //provisional
  //regresa false si no es el documento, regresa la info analizada si es el documento en cuestion
  const datos = respVision[0].description;
  let stsIne = await ine.getInfoFromIne(archivo, respVision); //necesita un tratamiento diferente
  let stsCfe = cfe.getInfoFromCfe(datos, rostro);//funcion asincona, esperar hasta que termine
  let stsTelmex = telmex.getInfoFromTelmx(respVision);
  let stsAxtel = axtel.getInfoFromAxt(datos, rostro);
  let stsPassMx = passMx.getInfoFromPasspMX(datos, rostro);
  let stsFormMigrtMx = formMigrtMx.getInfoFromFormMigMX(datos, rostro);
  let stsDni = dni.getInfoFromDni(datos, rostro);
  let stsLicDeCondCmdx = licDeCondCdmxs.getInfoFromLicDeCondCdmx(datos, rostro);
  let stsRecibPredialCmdx = reciboPredialCdmx.getInfoFromRecibPredialCdmx(datos, rostro);//funcion asincona, esperar hasta que termine
  let stsRecibAguaCmdx = reciboAguaCdmx.getInfoFromRecibAguaCdmx(datos, rostro);

  if (stsIne != false) return stsIne;
  if (stsCfe != false) return stsCfe;
  if (stsTelmex != false) return stsTelmex;
  if (stsAxtel != false) return stsAxtel;
  if (stsPassMx != false) return stsPassMx;
  if (stsFormMigrtMx != false) return stsFormMigrtMx;
  if (stsDni != false) return stsDni;
  if (stsLicDeCondCmdx != false) return stsLicDeCondCmdx;
  if (stsRecibPredialCmdx != false) return stsRecibPredialCmdx;
  if (stsRecibAguaCmdx != false) return stsRecibAguaCmdx;

  return getInfoFromUnkn(); //si ningun documento es reconocido se envia vacio
}

function getInfoFromUnkn() {
  let datosVacios = {
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
    wichOne: null,
    typeDoc: 'no se reconocio documento!',
    faceDetected: false
  };
  return datosVacios;
}
