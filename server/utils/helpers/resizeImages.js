const sharp = require('sharp');
const fs = require('fs');

const resizeImgs = async (img, width, high, ext, removeOldImg = true) => {

  if (!fs.existsSync(img)) return { ok: false, message: 'File does not exist.' };

  const dataImg = img.split('.');
  // Remove ext img
  dataImg.pop(-1);
  dataImg.push(`${width}-${high}`)
  const imgNoExtension = `${dataImg.join('.')}`
  await sharp(img).resize(width, high).toFile(`${imgNoExtension}.${ext}`);

  const dataNewImg = `${imgNoExtension}.${ext}`.split('/');
  const nameNewImg = dataNewImg[dataNewImg.length - 1];
  const pathNewImg = `${imgNoExtension}.${ext}`;

  if (removeOldImg) {
    fs.unlinkSync(img);
    return { ok: true, nameNewImg, pathNewImg, };
  };

  const dataOldImg = img.split('/');
  const nameOldImg = dataOldImg[dataOldImg.length - 1];

  return {
    ok: true,
    pathNewImg,
    pathOldImg: img,
    nameNewImg,
    nameOldImg,
  }
};

module.exports = {
  resizeImgs,
};