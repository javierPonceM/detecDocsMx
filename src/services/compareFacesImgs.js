const config = require("config");
const cropFaceInImg = require("./cropFaceInImg");
const compareTwoImg = require("./compareTwoImages");

const cropDir = config.get("dirs.cropDir");



module.exports.compare = (newFile, fileRecovered) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newFace = await cropFaceInImg.cropFace(newFile);
            let result = await compareTwoImg.compare(newFace, fileRecovered);
            resolve(result);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}
