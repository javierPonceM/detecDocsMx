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
    if (direction === 'up') {
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

// obtain the characters in a selected area, limit by words or coordenates( (0,0), (Xword,Yword) is the default)
module.exports.limitAreaForOcrXY = limitAreaForOcrXY = (infoFromPastOcr, wordLimit, wordLimit2) => {
  return new Promise((resolve, reject) => {
    let info = '', xlimit1 = '', ylimit1 = '', xlimit2 = 0, ylimit2 = 0, originX, originY, limitX, limitY;
    infoFromPastOcr.forEach(elm => {
      if (elm.description === wordLimit) {
        xlimit1 = elm.boundingPoly.vertices[0].x;
        ylimit1 = elm.boundingPoly.vertices[0].y;
      }
      if (elm == infoFromPastOcr[infoFromPastOcr.length - 1] && xlimit === '') {
        reject('no word '+wordLimit+'limit for limit the characters in image');
      }
    });

    if (wordLimit2 && typeof wordLimit2 === 'string') {
      infoFromPastOcr.forEach(elm => {
        if (elm.description === wordLimit2) {
          xlimit2 = elm.boundingPoly.vertices[0].x;
          ylimit2 = elm.boundingPoly.vertices[0].y;
        }
        if (elm == infoFromPastOcr[infoFromPastOcr.length - 1] && xlimit === '') {
          reject('no word ' +wordLimit2+ 'limit for limit the characters in image');
        }
      });
    }

    originX = xlimit1 < xlimit2 ? xlimit1 : xlimit2;
    originY = ylimit1 < ylimit2 ? ylimit1 : ylimit2;
    limitX = xlimit1 > xlimit2 ? xlimit1 : xlimit2;
    limitY = ylimit1 > ylimit2 ? ylimit1 : ylimit2;



    infoFromPastOcr.forEach(elm => {
      let coordX = elm.boundingPoly.vertices[0].x;
      let coordY = elm.boundingPoly.vertices[0].y
      if (coordX >= originX && coordX <= limitX && coordY >= originY && coordY <= limitY) {
        info = info.concat(' ' + elm.description);
      }
    });
    resolve(info);

  });
}
