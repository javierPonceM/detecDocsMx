
const config = require("config");
const gm = require('gm');
const cropDir = config.get("dirs.cropDir");

module.exports.compare = (file1, file2) => {
    return new Promise((resolve, reject) => {
        gm.compare(cropDir + file1, cropDir+ file2, function (err, isEqual, equality, raw, path1, path2) {
            if (err) reject(new Error('Error comparing images!'));

            // if the images were considered equal, `isEqual` will be true, otherwise, false.
            console.log(`The images were equal:  ${isEqual}`);

            // to see the total equality returned by graphicsmagick we can inspect the `equality` argument.
            console.log(`Actual equality: ${equality}`);

            // inspect the raw output
            console.log(raw);

            // print file paths
            console.log(path1, path2);
            resolve(isEqual);
        })
    })
}
