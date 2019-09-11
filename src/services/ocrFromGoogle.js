const config = require("config");
const vision = require('@google-cloud/vision');
const fs = require('fs');

const client = new vision.ImageAnnotatorClient();

const jsonResultsDir = config.get("dirs.jsonResultsDir");
const receivedDir = config.get("dirs.receivedDir");

module.exports.doOCR = async function (archivo) {

    let request = receivedDir + archivo;

    let [resultados] = await client.textDetection(request);
    let detections = resultados.textAnnotations;
    const respVision = detections[0].description;

    // fs.writeFile(jsonResultsDir + archivo.replace('.', '') + '.json', JSON.stringify(resultados), (err) => {
    //     if (!err) {
    //         console.log('saved JSON RESULTS! ')
    //     }
    // });
    return detections;
}
