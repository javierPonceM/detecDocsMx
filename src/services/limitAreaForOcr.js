// solo traemos las palabras encontradas en el area de la ine anterior a la leyenda "fecha"
// si queremos los datos de fecha de nacimiento y sexo, pues los obtenemos de la misma manera
module.exports.limitAreaForOcr = limitAreaForOcr= (infoFromPastOcr, wordLimit)=> {
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
  
      infoFromPastOcr.forEach(elm => {
        if (elm.boundingPoly.vertices[0].x < xlimit && elm.boundingPoly.vertices[1].x < xlimit) {
          info = info.concat(' ' + elm.description);
        }
      });
      resolve(info);
  
    });
  }