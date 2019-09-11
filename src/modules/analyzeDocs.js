const express = require('express');
const fs = require('fs');
const path = require('path');
const util = require('util');
const config = require('config');

const visionIMG = require('./google-vision-img.js');
const visionPDF = require('./google-vision-pdf.js');
const nombreBucket = config.get('google.bucketName');//nombre del bucket en google

const receivedDir = config.get("dirs.receivedDir");

let numKeys;
let analyze = (req, res) => { //se pasa el archivo a la peticion post
  var flag = 0;
  var arrNames = [];

  if (req.files == 'undefined' || req.files == null) {
    objVacio.data[0].dataDoc = 'Los datos no vienen en req.files, imposible ejecutar las acciones';
    res.send(objVacio);
  } else {
    var arrayDocType = {
      data: []
    };
    let response = '';
    let fileObj = req.files;
    numKeys = Object.keys(fileObj).length;
    console.log('========fileObj=========');
    console.log(fileObj);
    console.log('=================');

    for (item in fileObj) {
      let nombreDoc = fileObj[item].name;
      let typeMime = fileObj[item].mimetype;
      let datos = fileObj[item].data;
      // arrNames.push(nombreDoc);

      fs.writeFile(receivedDir + nombreDoc, datos, (err) => { //se guarda el archivo en el server
        if (err) throw err;
        console.log('Archivo guardado localmente!');
        if (typeMime == 'image/jpeg' || typeMime == 'image/x-png' || typeMime == 'image/png') {
          visionIMG.analisisVisionDoc(nombreDoc, arrayDocType, function (respuesta) {
            arrayDocType = respuesta;
            if (flag == numKeys - 1) res.send(respuesta);
            flag++;
          });
        }

        if (typeMime == 'application/pdf' || typeMime == 'image/tiff') {
          visionPDF.analisisVisionDoc(nombreDoc, typeMime, nombreBucket, arrayDocType, function (respuesta) {
            arrayDocType = respuesta;
            if (flag == numKeys - 1) res.send(respuesta);
            flag++;
          });
        }

        if (typeMime == 'application/octet-stream') {
          objVacio.data[0].dataDoc = 'Formato de archivo no compatible (typeMime : application/octet-stream)' +
            ', realice correctamente la petición.';
          res.send(objVacio);
        }
      });
    }
  }
};

// http://servidorcmc.sytes.net:8081
// http://localhost:8081

module.exports.analyze = analyze;

var objVacio = {
  data: [{
    idTypeDoc: 0,
    typeDoc: '',
    dataDoc: '',
    dataAnalized: {
      idTypeDoc: 0,
      nombre: {
        fullName: '',
        ape1: '',
        ape2: '',
        name1: '',
        name2: ''
      },
      domicilio: '',
      cp: '',
      wichOne: '',
      typeDoc: ''
    }
  }]
};



// clave de application
// AIzaSyBACLXTnqBDGjNwPoAmCpwhHBtIs73643Q
