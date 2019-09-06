const exprCp = /C\.?P\.?/ig,
  exprCp1 = /\d{5}/ig,
  expTlmx = /TELEF[O0]N[O0]S\sDE\sM[EéÉ]X[I1l]C[O0]/ig,
  // expInfImp = /([A-Z]{2,20}\s){2,5}/g,
  expInfImp = /\s?[A-Z]{2,20}\s/,
  expRfc1 = /RFC/ig,
  expRfc2 = /RFC\sP[UÚ]BL[I1l]C[O0]/ig,
  expMinus = /[A-Z]?[a-z]{1,20}/,
  expTel = /\s\d{4}\s/,
  expFecha = /(\d{2}[/|-][A-Z]{3}[/|-]\d{4})/i,
  expSl = /\n/g;


let getInfoFromTelmx = async function(datos, rostro) {
  let tmxCompDom, arrRfc1, arrRfc2, posRfc1, posRfc2,
    datosRep, datosRep1, datosRep2, arrInfImp, posInfImp, arrCP, posCP,
    fullName, partName, domicilio, cp0, cpValue, secondname, datosDoc, domicilio0;

  tmxCompDom = expTlmx.test(datos);

  if (tmxCompDom == true) {

    arrRfc1 = datos.match(expRfc1);
    posRfc1 = datos.indexOf(arrRfc1[0]);
    arrRfc2 = datos.match(expRfc2);
    posRfc2 = datos.indexOf(arrRfc2[0]);

    datosRep = datos.slice(posRfc1 + 4, posRfc2);
    datosRep1 = datosRep.split(expSl);
    datosRep2 = await limparArr(datosRep1);//se regresa un arreglo con la info importante

    fullName = datosRep2[0];
    partName = fullName.split(' ');

    arrInfImp = datosRep.match(expInfImp);
    posInfImp = datosRep.indexOf(arrInfImp[0]);
    arrCp = datosRep.match(exprCp);
    posCp = datosRep.indexOf(arrCp[0]);
    datosRep2[0] = '';
    domicilio0 = datosRep2.toString(); //se elimino linea de nombre y de cp, ahora se pasa a string que contiene la direccion
    domicilio = domicilio0.replace(/,/g, ' '); //remplazar las comas de la cadena por espacios

    datosRep1 = datosRep.slice(posInfImp, posCp + 11);
    datosRep2 = datosRep1.split('\n');
    cp0 = datosRep2[datosRep2.length - 1];
    cpValue = cp0.match(exprCp1);

    secondname = (nombreArr => {
      if (nombreArr[3]) return nombreArr[3];
      else return '';
    });

    datosDoc = {
      idTypeDoc: 2,
      nombre: {
        fullName: fullName,
        ape1: partName[0],
        ape2: partName[1],
        name1: partName[2],
        name2: secondname(partName)
      },
      domicilio: domicilio,
      cp: cpValue[0],
      wichOne: 'Recibo de teléfono Telmex',
      typeDoc: 'comprobante domicilio',
      faceDetected: rostro
    };
    return datosDoc;
  } else {
    return false;
  }
}

function limparArr(arr) {
//se salvara lo que importa, palabras en mayusculas, nada de numeros, fechas, minusculas
  let arrClean = [],
    valExp1, valExp2, valExp3;
  for (var i = 0; i < arr.length; i++) {
    valExp1 = expMinus.test(arr[i]) || expTel.test(arr[i]);
    valExp2 = expFecha.test(arr[i]);
    valExp3 = expInfImp.test(arr[i]);
    if (valExp1 || valExp2) {
      arr[i] = '';
    } else {
      if (valExp3) {
        arrClean.push(arr[i]);
      }
    }
  }
  return arrClean;
}


module.exports.getInfoFromTelmx = getInfoFromTelmx;
