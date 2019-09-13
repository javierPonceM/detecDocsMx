var faceDetectionService = require('./faceDetection');
var cropImgsService = require('./cropImages');

module.exports.cropFace = cropFace = async (fileName) => {
    try {
        let width, higth, xinit, yinit;
        let faceCoord = await faceDetectionService.detectFaces(fileName);
        if (faceCoord.face[0].width) {
            width = faceCoord.face[0].width;
            higth = faceCoord.face[0].higth;
            xinit = faceCoord.face[0].xinit;
            yinit = faceCoord.face[0].yinit;
            let fileCroped = await cropImgsService.cropImage(fileName, width, higth, xinit, yinit);
            return fileCroped;
        }
    } catch (error) {
        console.error(error);
        return new Error('error en cropFaceInImg.js');
    }
}