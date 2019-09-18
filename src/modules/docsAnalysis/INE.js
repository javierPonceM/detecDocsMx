const config = require('config');
const getInfoFromArea = require(process.cwd() + '/src/services/limitAreaForOcr');

const exprFechNaci = /FE[CG]HA\sDE\sNAC[I1lL]M[I1lL]ENT[ÓO0]/ig,
  exprNomb = /N[ÓO0]MBRE/ig,
  paramIne = /[I1lL]NST[I1lL]TUT[ÓO0]\sNAC[I1lL][ÓO0]NAL\sELE[CG]T[ÓO0]RAL/ig,
  paramIne1 = /[CG]REDEN[CG][I1lL]AL\sPARA\sV[ÓO0]TAR/ig,
  exprCp = /\d{5}/,
  expFecha = /(\d{2}[/|-]\d{2}[/|-]\d{4})/ig,
  expClaEle = /[CG]LAVE\sDE\sELE[CG]T[ÓO0]R/ig,
  sL = /\n/g,
  expSex = /SEX[ÓO0]\s[H|M]/g,
  expDom = /D[ÓO0]M[I1lL][CG][I1lL]L[I1lL][ÓO0]/g,
  expMinus = /[a-z]{1,25}/g;
  expVig = /V[I1lL][GC]EN[CG][I1lL]A\s\d{4}/g;


let getInfoFromIne = async function (nameFile, datos) {
  let ine, ine1, arrNomb, posNombre, arrClav, posClave, datosRep,
    datosRep1, datosRep2, nombre, domicilio, nombreArr, secondname,
    codPost, datosDoc, datos1, arrSex, sexo, arrFechaNac, fechaNac;

  ine = paramIne.test(datos[0].description);
  ine1 = paramIne1.test(datos[0].description);
  // console.log(datos);
  if (ine == true && ine1 == true) {
    arrSex = datos[0].description.match(expSex);
    sexo = arrSex[0] ? arrSex[0].replace('SEXO', '') : '';
    arrFechaNac = datos[0].description.match(expFecha);
    fechaNac = arrFechaNac[0] ? arrFechaNac[0].replace(/\//g,'-') : null;
    arrVig = datos[0].description.match(expVig);
    vigencia = arrVig[0] ? arrVig[0].replace('VIGENCIA ', '') : '';

    // el ocr de las nuevas ine trae consigo mucha basura, por lo que habra que limitar el area de donde se extrae el texto
    datos1 = await getInfoFromArea.limitAreaForOcrX(datos, 'FECHA', 'left');

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
      sexo: sexo,
      fechaNacimiento: fechaNac,
      vigencia: vigencia,
      rostro: '',
      validezDoc: true
    };
    return datosDoc;

  } else {
    return false;
  }
}

module.exports.getInfoFromIne = getInfoFromIne;

// cropImage = cropService.cropImage(inputFile, width, higth, xinit, yinit);