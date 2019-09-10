const exprFechNaci = /FECHA\sDE\sNAC[I1lL]M[I1lL]ENT[ÓO0]/ig,
  exprNomb = /N[ÓO0]MBRE/ig,
  paramIne = /INSTITUT[ÓO0]\sNAC[I1lL]ONAL\sELECT[ÓO0]RAL/ig,
  paramIne1 = /CREDENC[I1lL]AL\sPARA\sV[ÓO0]TAR/ig,
  exprCp = /\d{5}/,
  expFecha = /(\d{2}[/|-]\d{2}[/|-]\d{4})/ig,
  expClaEle = /CLAVE\sDE\sELECT[ÓO0]R/ig,
  expDomi = /D[ÓO0]M[I1lL]C[I1lL]L[I1lL][ÓO0]/ig,
  sL = /\n/g,
  expSex = /SEX[ÓO0]\s[H|M]/g,
  expDom = /D[ÓO0]M[I1lL]C[I1lL]L[I1lL][ÓO0]/g,
  expMinus = /[a-z]{1,25}/g;

  // el ocr de las nuevas ine trae consigo mucha basura, por lo que habra que recortar la imagen y hacer el ocr de nuevo

let getInfoFromIne = async function(datos, rostro) {
  let ine, ine1, arrNomb, posNombre, arrClav, posClave, datosRep,
    datosRep1, datosRep2, nombre, domicilio, nombreArr, secondname,
    codPost, datosDoc;
  ine = paramIne.test(datos);
  ine1 = paramIne1.test(datos);

  console.log(datos);
  if (ine == true && rostro == true && ine1 == true ) {

    
    //extraccion de datos de una ine nacional (no extranjera)
    arrNomb = datos.match(exprNomb);
    posNombre = datos.indexOf(arrNomb[0]);

    arrClav = datos.match(expClaEle);
    posClave = datos.indexOf(arrClav[0]);

    datosRep = datos.slice(posNombre + 7, posClave);
    datosRep1 = datosRep.split(sL);

    datosRep2 = await limparArr(datosRep1);
    nombre = datosRep2[0] + ' ' + datosRep2[1] + ' ' + datosRep2[2];
    domicilio = datosRep2[3] + ' ' + datosRep2[4] + ' ' + datosRep2[5];
    nombreArr = nombre.split(' ');
    secondname = (nombreArr => {
      if (nombreArr[3]) return nombreArr[3];
      else return '';
    });
    codPost = domicilio.match(exprCp);
    domicilio = domicilio.replace(codPost,'');
    console.log(datosRep2);

    datosDoc = {
      idTypeDoc: 1,
      nombre: {
        fullName: nombre,
        ape1: nombreArr[0],
        ape2: nombreArr[1],
        name1: nombreArr[2],
        name2: secondname(nombreArr)
      },
      domicilio: domicilio,
      cp: codPost[0],
      wichOne: 'INE',
      typeDoc: 'identificación personal',
      faceDetected: rostro
    };
    return datosDoc;
  } else {
    return false;
  }
}

async function limparArr(arr) {
  let arrClean = [],
    valExp1, valExp2;

  for (var i = 0; i < arr.length; i++) {
    valExp1 = expSex.test(arr[i]) || expDom.test(arr[i]);
    valExp2 = exprFechNaci.test(arr[i]) || expFecha.test(arr[i]) || expMinus.test(arr[i]);

    if (valExp1 || valExp2) {
      arr[i] = '';
    } else {
      arrClean.push(arr[i]);
    }
  }
  return arrClean;
}

module.exports.getInfoFromIne = getInfoFromIne;
