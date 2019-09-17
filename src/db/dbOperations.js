const dbClient = require('./dbClient');

module.exports.dbInsertData = dbInsertData = (data) => {
    return new Promise((resolve, reject) => {
        let valuesForDb = [];
        valuesForDb.push(data.wichOne);
        valuesForDb.push(data.nombre.name1 + ' ' + data.nombre.name2);
        valuesForDb.push(data.nombre.ape1 + ' ' + data.nombre.ape2);
        valuesForDb.push(data.fechaNacimiento);
        valuesForDb.push(data.domicilio);
        valuesForDb.push(data.cp);
        valuesForDb.push(data.validezDoc);

        let sentencia = 'INSERT INTO infoFromDocs (documento, nombres, apellidos, fechaNacimiento, direccion, cp, validez) VALUES ($1,$2,$3,$4,$5,$6,$7)';
        dbClient.query(sentencia, valuesForDb, (err, result) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log("Datos del documento guardados!!");
                resolve(true);
            }
        });
    });
}

module.exports.dbInsertCropImg = dbInsertCropImg = (data, id) => {
    return new Promise((resolve, reject) => {
        let valuesForDb = [data, id];
        let sentencia = 'UPDATE infoFromDocs SET rostro=($1) WHERE id=($2)';
        dbClient.query(sentencia, valuesForDb, (err, response) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log("RCrop de imagen guardada!");
                resolve(true);
            }
        });
    });
}

module.exports.dbRecuperateId = dbRecuperateId = (data) => {
    return new Promise((resolve, reject) => {
        let valuesForDb = [];
        valuesForDb.push(data.wichOne);
        valuesForDb.push(data.nombre.name1 + ' ' + data.nombre.name2);
        valuesForDb.push(data.nombre.ape1 + ' ' + data.nombre.ape2);
        valuesForDb.push(data.fechaNacimiento);
        valuesForDb.push(data.domicilio);
        valuesForDb.push(data.cp);
        valuesForDb.push(data.validezDoc);
        let sentencia = 'SELECT id from infoFromDocs where documento=($1) AND nombres=($2) AND apellidos=($3) AND fechaNacimiento=($4) AND direccion=($5) AND cp=($6) AND validez=($7)';
        dbClient.query(sentencia, valuesForDb, (err, response) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                if (response.rows[0]) {
                    console.log("ID Recuperado", response.rows[0]);
                }
                response.rows[0] ? resolve(response.rows[0].id): resolve(null);
            }
        });
    });
}

module.exports.getFaceFromDb = (id) => {
    return new Promise((resolve, reject) => {
        let valuesForDb = [id];
        let sentencia = 'SELECT rostro FROM infoFromDocs WHERE id=($1)';
        dbClient.query(sentencia, valuesForDb, (err, response) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                if (response.rows[0]) {
                    console.log("Datos del rostro recuperados");
                }
                response.rows[0] ? resolve(response.rows[0].rostro): resolve(null);
            }
        });
    });
}