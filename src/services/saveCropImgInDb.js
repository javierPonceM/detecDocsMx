const config = require('config');
const fs = require('fs');
var dbOperations = require(process.cwd() + '/src/db/dbOperations');

const cropDir = config.get("dirs.cropDir");

module.exports.saveCropImgInDb = saveCropImgInDb = (cropImg, id) => {
    return new Promise((resolve, reject) => {
        fs.readFile(cropDir + cropImg, 'hex', async function (err, imgData) {
            try {
                imgData = '\\x' + imgData;
                let saved = await dbOperations.dbInsertCropImg(imgData, id);
                resolve(saved);
            } catch (error) {
                reject(error);
            }
        });
    });
}



//   app.get('/url/to/get/', function(req, res, next) {
//     app.pgClient.query('select image from image_table limit 1',
//                        function(err, readResult) {
//       console.log('err',err,'pg readResult',readResult);
//       fs.writeFile('/tmp/foo.jpg', readResult.rows[0].image);
//       res.json(200, {success: true});
//     });
//   });