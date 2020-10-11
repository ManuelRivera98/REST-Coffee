const fs = require('fs');
const path = require('path');

class FilesLib {
  async saveFile(infoFile, idCollectionDB, dataDestFolder) {

    const { newFile, oldFile, allowedExtensions } = infoFile;

    const dataFile = newFile.name.split('.');
    const fileName = dataFile[0];
    const extFile = dataFile[dataFile.length - 1];

    if (allowedExtensions.indexOf(extFile) < 0) return { ok: false, response: `The allowed extensions are ${allowedExtensions.join(', ')}` };

    const { destFolder, desTypeFolder } = dataDestFolder;
    const pathFolder = path.resolve(__dirname, `../../${destFolder}/${desTypeFolder}`);

    const newFileName = `${fileName}-${idCollectionDB}-${new Date().getMilliseconds()}.${extFile}`;
    await newFile.mv(`${pathFolder}/${newFileName}`);

    if (fs.existsSync(`${pathFolder}/${oldFile}`)) {
      fs.unlinkSync(`${pathFolder}/${oldFile}`)
    };

    return {
      ok: true,
      nameFile: newFileName,
      path: `${pathFolder}/${newFileName}`,
    };
  };
};

module.exports = {
  FilesLib,
};