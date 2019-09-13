var cropFaceService = require(process.cwd() + '/src/services/cropFaceInImg');
var db = require(process.cwd() + '/src/db/dbOperations');
const saveCropImg = require(process.cwd() + '/src/services/saveCropImgInDb').saveCropImgInDb;

module.exports.saveDataInDb = saveDataInDb = async (datosDoc, nameFile) => {
    // se guarda el texto plano pero ademas se guarda el rostro(como imagen) detectado
    try {
        let saved = await db.dbInsertData(datosDoc);
        if (saved) {
            let faceImg = await cropFaceService.cropFace(nameFile);
            console.log("resultado de faceimgService");
            console.log(typeof faceImg == "string" ? faceImg + " contiene la cara!!" : faceImg);
            let id = await db.dbRecuperateId(datosDoc);
            let savedCropImg = await saveCropImg(faceImg, id);
            return savedCropImg;
        } else {
            return false;
        }
    } catch (error) {
        console.log('error guardando datos con rostro')
        console.log(error)
        return false;
    }
}