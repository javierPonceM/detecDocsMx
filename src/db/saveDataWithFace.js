var cropFaceService = require(process.cwd() + '/src/services/cropFaceInImg');
var db = require(process.cwd() + '/src/db/dbOperations');
const saveCropImg = require(process.cwd() + '/src/services/saveCropImgInDb').saveCropImgInDb;
var deleteFile = require(process.cwd() + '/src/services/deleteFiles.js');

module.exports.saveData = async (datosDoc, nameFile) => {
    // se guarda el texto plano pero ademas se guarda el rostro(como imagen) detectado
    try {
        let saved = await db.dbInsertData(datosDoc);
        if (saved) {
            let faceImg = await cropFaceService.cropFace(nameFile);
            console.log("resultado de faceimgService");
            console.log(typeof faceImg == "string" ? faceImg + " contiene la cara!!" : faceImg);
            let id = await db.dbRecuperateId(datosDoc);
            let savedCropImg = await saveCropImg(faceImg, id);
            deleteFile.deleteCropImgInServ(faceImg);//borrar los archivos recibidos que se guardaron en el server
            return savedCropImg;
        } else {
            console.log("No se pudo guardar los datos!");
            return false;
        }
    } catch (error) {
        console.log('error guardando datos con rostro')
        console.log(error)
        return false;
    }
}