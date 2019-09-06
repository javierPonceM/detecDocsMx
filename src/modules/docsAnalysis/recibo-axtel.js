const exprCp = /C\.?P\.?/ig,
  exprCp1 = /\d{5}/ig,
  expMesFact = /Mes\sde\sFact[UÚ]rac[I1l][O0óÓ]n/ig,
  expEdoCta = /Estad[O0]\sde\sc[UÚ]enta/ig,
  expInfImp = /[A-Z]{3,20}/,
  expMinus = /[A-Z]?[a-z]{1,20}/,
  expFecha = /(\d{2}[/|-][A-Z]{3}[/|-]\d{4})/i,
  expSl = /\n/g,
  expTel = /\d{4}/g;

let getInfoFromAxt = async function(datos, rostro) {
  let axtelComp = /axtel/i.test(datos);

  if (axtelComp == true) {
    let arrMesFact = datos.match(expMesFact);
    let posMesFact = datos.indexOf(arrMesFact[0]);
    let arrEdoCta = datos.match(expEdoCta);
    let posEdoCta = datos.indexOf(arrEdoCta[0]);

    let datosRep = datos.slice(posMesFact + 13, posEdoCta);
    let datosRep1 = datosRep.split(expSl);
    let datosRep2 = await limparArr(datosRep1);

    let nombre = datosRep2[0];
    let nombreArr = nombre.split(' ');
    let secondname = (nombreArr => {
      if (nombreArr[3]) return nombreArr[1];
      else return '';
    });

    datosRep2[0] = '';
    datosRep1 = datosRep2.toString(); //se elimino linea de nombre y de cp, ahora se pasa a string que contiene la direccion
    let direccion = datosRep1.replace(/,/g, ' '); //remplazar las comas de la cadena por espacios

    let codPost = direccion.match(exprCp1);

    let datosDoc = {
      idTypeDoc: 2,
      nombre: {
        fullName: nombre,
        ape1: nombreArr[nombreArr.length - 2],
        ape2: nombreArr[nombreArr.length - 1],
        name1: nombreArr[0],
        name2: secondname(nombreArr)
      },
      domicilio: direccion,
      cp: codPost[0],
      wichOne: 'Recibo de teléfono Axtel',
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
    valExp1, valExp2;
  for (var i = 0; i < arr.length; i++) {
    valExp1 = expMinus.test(arr[i]);
    valExp2 = expInfImp.test(arr[i]);
    if (valExp1) {
      arr[i] = '';
    } else {
      if (valExp2 && !arr[i].includes('RFC')) {
        arrClean.push(arr[i]);
      }
    }
  }
  return arrClean;
}

module.exports.getInfoFromAxt = getInfoFromAxt;
