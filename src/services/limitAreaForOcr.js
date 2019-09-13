// solo traemos las palabras encontradas en el area de la ine anterior a la leyenda "fecha"

// barrido horizontal en base a una palabra, y un sentido, querer lo de la derecha o izquierda
module.exports.limitAreaForOcrX = limitAreaForOcrX = (infoFromPastOcr, wordLimit, direction) => {
  return new Promise((resolve, reject) => {
    let info = '', xlimit = '';

    infoFromPastOcr.forEach(elm => {
      if (elm.description === wordLimit) {
        xlimit = elm.boundingPoly.vertices[0].x;
      }
      if (elm == infoFromPastOcr[infoFromPastOcr.length - 1] && xlimit === '') {
        reject('no word limit for limit the caracters in image');
      }
    });
    if (direction === 'left') {

      infoFromPastOcr.forEach(elm => {
        if (elm.boundingPoly.vertices[0].x < xlimit && elm.boundingPoly.vertices[1].x < xlimit) {
          info = info.concat(' ' + elm.description);
        }
      });
    } else {
      infoFromPastOcr.forEach(elm => {
        if (elm.boundingPoly.vertices[0].x > xlimit && elm.boundingPoly.vertices[1].x > xlimit) {
          info = info.concat(' ' + elm.description);
        }
      });
    }

    resolve(info);

  });
}

// barrido vertical en base a una palabra, y un sentido, querer lo de arriba o lo de abajo
module.exports.limitAreaForOcrY = limitAreaForOcrY = (infoFromPastOcr, wordLimit, direction) => {
  return new Promise((resolve, reject) => {
    let info = '', ylimit = '';

    infoFromPastOcr.forEach(elm => {
      if (elm.description === wordLimit) {
        ylimit = elm.boundingPoly.vertices[0].y;
      }
      if (elm == infoFromPastOcr[infoFromPastOcr.length - 1] && ylimit === '') {
        reject('no word limit for limit the caracters in image');
      }
    });
    if (direction === 'down') {
      infoFromPastOcr.forEach(elm => {
        if (elm.boundingPoly.vertices[0].y > ylimit && elm.boundingPoly.vertices[1].y > ylimit) {
          info = info.concat(' ' + elm.description);
        }
      });
    } else {
      infoFromPastOcr.forEach(elm => {
        if (elm.boundingPoly.vertices[0].y < ylimit && elm.boundingPoly.vertices[1].y < ylimit) {
          info = info.concat(' ' + elm.description);
        }
      });
    }

    resolve(info);

  });
}

// prndiente
// obtain the characters in a selected area, limit by words or coordenates( (0,0), (Xword,Yword) is the default)
module.exports.limitAreaForOcrXY = limitAreaForOcrXY = (infoFromPastOcr, wordLimit, wordLimit2 ) => {
  return new Promise((resolve, reject) => {
    let info = '', xlimit = '', ylimit='', coordX=0, coordY=0;
    infoFromPastOcr.forEach(elm => {
      if (elm.description === wordLimit) {
        xlimit = elm.boundingPoly.vertices[0].x;
        ylimit = elm.boundingPoly.vertices[0].y;
      }
      if (elm == infoFromPastOcr[infoFromPastOcr.length - 1] && xlimit === '') {
        reject('no word limit for limit the caracters in image');
      }
    });
if(wordLimit2){

}

    infoFromPastOcr.forEach(elm => {
      if (elm.boundingPoly.vertices[0].x < xlimit && elm.boundingPoly.vertices[1].x < xlimit) {
        info = info.concat(' ' + elm.description);
      }
    });
    resolve(info);

  });
}
