const exprFechNaci = /FECHA\sDE\sNAC[I1l]M[I1l]ENT[O0]/i,
  exprNomb = /N[O0]MBRE/i,
  paramIne = /INSTITUT[O0]\sNAC[I1l]ONAL\sELECT[O0]RAL/i,
  paramIne1 = /CREDENC[I1l]AL\sPARA\sV[O0]TAR/i,
  exprCp = /\d{5}/,
  expFecha = /(\d{2}[/|-]\d{2}[/|-]\d{4})/i,
  expClaEle = /CLAVE\sDE\sELECT[O0]R/i,
  expDomi = /D[O0]M[I1l]C[I1l]L[I1l][O0]/i,
  sL = /\n/g,
  expSex = /SEXO\s[H|M]/g,
  expDom = /D[O0]M[I1l]C[I1l]L[I1l][O0]/g,
  expMinus = /[a-z]{1,25}/g;

let getInfoFromIne = async function(datos, rostro) {
  var ine, ine1, arrNomb, posNombre, arrClav, posClave, datosRep,
    datosRep1, datosRep2, nombre, domicilio, nombreArr, secondname,
    codPost, datosDoc;
  ine = paramIne.test(datos);
  ine1 = paramIne1.test(datos);

  if ((ine == true && rostro == true) || (ine1 == true && rostro == true)) {

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
