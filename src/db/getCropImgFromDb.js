const config = require('config');
const fs = require("fs");
const db = require(process.cwd() + '/src/db/dbOperations');

const cropDir = config.get("dirs.cropDir");

module.exports.getFaceImg = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let rostroData = await db.getFaceFromDb(id);
            let nameFile = `cropFace_${id}.jpg`;
            fs.writeFile(cropDir + nameFile, rostroData, (err, result) => {
                if (err) throw new Error('Error writing data of crop Face From db');
                resolve(nameFile);
            });
        } catch (error) {
            reject(error);
        }
    });
}
