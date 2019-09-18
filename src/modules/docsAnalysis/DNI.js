const getInfoFromArea = require(process.cwd() + '/src/services/limitAreaForOcr');
// datos1 = await getInfoFromArea.limitAreaForOcrX(datos, 'FECHA', 'left');

const exprEsp = /ESPA[N|Ñ]A/ig;
const exprFechNaci = /FECHA\sDE\sNAC[I1lL]M[I1lL]ENT[O0Ó]/i;
const expDni = /(D[O0Ó]CUMENT[O0Ó]\sNACI[O0Ó]NAL\sDE\sIDENTIDAD)|(C[E|É]DULA\sDE\sIDENTIDAD)|(DNI)/ig;
const expr1erApe = /PR[I1lL]MER\sAPELLID[O0Ó]/i;
const expr2doApe = /SEGUND[O0Ó]\sAPELLID[O0Ó]/i;
const exprNomb = /N[O0Ó]MBRE/i;
const exprNaci = /NAC[I1lL][O0Ó]NALIDAD/i;
const exprsex1 = /SEX[O0Ó]/i;
const sL = /\n/g;


let getInfoFromDni = (info, rostro) => {
  let dniComp, posApe, posNom, posSex, apellidos, nombre, apellidosArr, nombreArr,
    datosDoc, arr1erAp, pos1erApe, arr2doAp, pos2doApe, arrNomb, posNombre, arrNaci,
    posNacion, arrSex1, posSex1, arrFechNaci, posFechNaci, ape1, ape2, secondname, datos;

    datos = info.toUpperCase().replace(sL, ' '); //quitar los saltos de linea
    
    dniComp = expDni.test(datos);

    if (dniComp == true && rostro == true) {
      datos1 = datos.replace(exprEsp, '');
      
      posApe = datos1.indexOf('APELLIDOS');
      posNom = datos1.indexOf('NOMBRE');
    posSex = datos1.indexOf('SEXO');
    
    if (posApe != -1 && posNom != -1 && posSex != -1) {
      //para el otro tipo de dni (una que consulte en internet)
      apellidos = datos1.slice(posApe + 10, posNom);
      nombre = datos1.slice(posNom + 7, posSex);
      apellidosArr = apellidos.split(' ');
      nombreArr = nombre.split(' ');
      
      datosDoc = {
        idTypeDoc: 1,
        nombre: {
          fullName: apellidos + nombre,
          ape1: apellidosArr[0],
          ape2: apellidosArr[1],
          name1: nombreArr[0],
          name2: ''
        },
        domicilio: '',
        cp: '',
        wichOne: 'Documento Nacional De Identidad',
        typeDoc: 'identificación personal',
        faceDetected: rostro
      };
      return datosDoc;
    }
    
    arr1erAp = datos1.match(expr1erApe);
    pos1erApe = datos1.indexOf(arr1erAp[0]);
    
    arr2doAp = datos1.match(expr2doApe);
    pos2doApe = datos1.indexOf(arr2doAp[0]);
    
    arrNomb = datos1.match(exprNomb);
    posNombre = datos1.indexOf(arrNomb[0]);
    
    arrNaci = datos1.match(exprNaci);
    posNacion = datos1.indexOf(arrNaci[0]);
    
    arrSex1 = datos1.match(exprsex1);
    posSex1 = datos1.indexOf(arrSex1[0]);
    
    arrFechNaci = datos1.match(exprFechNaci);
    posFechNaci = datos1.indexOf(arrFechNaci[0]);
    
    ape1 = datos1.slice(pos1erApe + 16, pos2doApe);
    //para quitar caracteres raros que detecta el ocr
    ape1 = ape1.split(' ');
    ape1 = ape1[0]+' ';

    ape2 = datos1.slice(pos2doApe + 17, posNombre);
    nombre = datos1.slice(posNombre + 7, posSex1);
    nombreArr = nombre.split(' ');
    console.log(datos1);
    
    secondname = (nombreArr => {
      if (nombreArr[1]) return nombreArr[1];
      else return '';
    });

    datosDoc = {
      idTypeDoc: 1,
      nombre: {
        fullName: ape1 + ape2 + nombre,
        ape1: ape1,
        ape2: ape2,
        name1: nombreArr[0],
        name2: secondname(nombreArr)
      },
      domicilio: '',
      cp: '',
      wichOne: 'Documento Nacional De Identidad',
      typeDoc: 'identificación personal',
      faceDetected: rostro
    };
    // TODO: checar si vale la pena validar la vigencia de la identificacion
    // TODO: guardar estos datos en una db
    return datosDoc;
  } else {
    return false;
  }
}

module.exports.getInfoFromDni = getInfoFromDni;
