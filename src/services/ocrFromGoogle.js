const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
const receivedDir = process.cwd() + '/docs/docsReceived/';

const fs = require('fs');


module.exports.doOCR = async function (archivo) {

    let request = receivedDir + archivo;

    let [resultados] = await client.textDetection(request);
    let detections = resultados.textAnnotations;
    const respVision = detections[0].description;

    // fs.writeFile('./docs/jsonResults/' + archivo.replace('.', '') + '.json', JSON.stringify(resultados), (err) => {
    //     if (!err) {
    //         console.log('saved JSON RESULTS! ')
    //     }
    // });
    return detections;
}
