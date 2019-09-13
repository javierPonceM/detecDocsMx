const config = require('config');
const db = require(process.cwd() + '/src/db/dbOperations');
const saveCropImgInDb = require(process.cwd() + '/src/db/saveDataWithFace').saveCropImgInDb;

const getInfoFromArea = require(process.cwd() + '/src/services/limitAreaForOcr');

const exprFechNaci = /FECHA\sDE\sNAC[I1lL]M[I1lL]ENT[ÓO0]/ig,
  exprNomb = /N[ÓO0]MBRE/ig,
  paramIne = /INSTITUT[ÓO0]\sNAC[I1lL]ONAL\sELECT[ÓO0]RAL/ig,
  paramIne1 = /CREDENC[I1lL]AL\sPARA\sV[ÓO0]TAR/ig,
  exprCp = /\d{5}/,
  expFecha = /(\d{2}[/|-]\d{2}[/|-]\d{4})/ig,
  expClaEle = /CLAVE\sDE\sELECT[ÓO0]R/ig,
  sL = /\n/g,
  expSex = /SEX[ÓO0]\s[H|M]/g,
  expDom = /D[ÓO0]M[I1lL]C[I1lL]L[I1lL][ÓO0]/g,
  expMinus = /[a-z]{1,25}/g;

const cropDir = config.get("dirs.cropDir");


let getInfoFromIne = async function (nameFile, datos) {
  let ine, ine1, arrNomb, posNombre, arrClav, posClave, datosRep,
  datosRep1, datosRep2, nombre, domicilio, nombreArr, secondname,
  codPost, datosDoc, datos1;

  ine = paramIne.test(datos[0].description);
  ine1 = paramIne1.test(datos[0].description);
  // console.log(datos);
  if (ine == true && ine1 == true) {
    // el ocr de las nuevas ine trae consigo mucha basura, por lo que habra que limitar el area de donde se extrae el texto
    datos1 = await getInfoFromArea.limitAreaForOcr(datos, 'FECHA');
    
    
    //extraccion de datos de una ine (no extranjera)
    arrNomb = datos1.match(exprNomb);
    posNombre = datos1.indexOf(arrNomb[0]);
    
    arrClav = datos1.match(expClaEle);
    posClave = datos1.indexOf(arrClav[0]);

    datosRep = datos1.slice(posNombre + 7, posClave);
    datosRep1 = datosRep.split(expDom);
    console.log(datosRep1);

    nombre = datosRep1[0];
    domicilio = datosRep1[1];
    nombreArr = nombre.split(' ');

    secondname = (nombreArr => {
      if (nombreArr[3]) return nombreArr[3];
      else return '';
    });

    codPost = domicilio.match(exprCp);
    domicilio = domicilio.replace(codPost, '');
    //TODO: recuperar fecha nacimiento y sexo    
    datosDoc = {
      idTypeDoc: 1,
      nombre: {
        fullName: nombreArr[0] + ' ' + nombreArr[1] + ' ' + nombreArr[2] + ' ' + secondname(nombreArr),
        ape1: nombreArr[0],
        ape2: nombreArr[1],
        name1: nombreArr[2],
        name2: secondname(nombreArr)
      },
      domicilio: domicilio,
      cp: codPost[0],
      wichOne: 'INE',
      typeDoc: 'identificación personal',
      faceDetected: true,
      fechaNacimiento: new Date('2002-01-01'),
      rostro: '',
      validezDoc: true
    };
    return datosDoc;
    // obtener id, si hay procede a comparar, si no que se guarden
    let idBd = await db.dbRecuperateId(datosDoc);
    if (idBd) {
      console.log(idBd, "id en la base de datos dela informacion ");
    } else {
      let savedData = saveCropImgInDb(datosDoc, nameFile);
      if (savedData) {
        return datosDoc;

      } else {
        return false;
      }
    }

  } else {
    return false;
  }
}

module.exports.getInfoFromIne = getInfoFromIne;

// cropImage = cropService.cropImage(inputFile, width, higth, xinit, yinit);
