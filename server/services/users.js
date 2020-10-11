const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');
// Lib
const { MongoLib } = require('../lib/mongo');
const { FilesLib } = require('../lib/files');
// Conf
const { config } = require('../config');
// Helpers
const { resizeImgs } = require('../utils/helpers/resizeImages');

class UsersService {
  constructor() {
    this.collection = 'user';
    this.mongoDB = new MongoLib();
    this.filesLib = new FilesLib();
  };

  async createUser(data, userSchema) {
    const { password } = data;
    let newData = data;
    if (password) {
      const encryptedPassword = await bcrypt.hash(password, 10);
      newData = { ...data, password: encryptedPassword, img: config.imgDefaultName, };
    };

    const addData = {
      ...newData,
      created: format(new Date(), 'dd-MM-yyyy'), modified: format(new Date(), 'dd-MM-yyyy')
    };

    const user = await this.mongoDB.create(this.collection, userSchema, addData);
    return user;
  };

  async updateUser(id, data, schema) {
    const addData = {
      ...data,
      modified: format(new Date(), 'dd-MM-yyyy'),
    };
    const user = await this.mongoDB.update(this.collection, schema, id, addData, { status: true });
    return user || {};
  };

  async getUsers(schema, conditions, email = false) {
    // Add values that we are going to return
    const addConditions = {
      ...conditions,
      returnValues: 'name email google role password img',
    };

    const query = email ? { email, status: true, } : { status: true, };

    if (conditions.search) {
      const regex = new RegExp(conditions.search, 'i');
      query.name = regex;
    };
    const users = await this.mongoDB.getAll(this.collection, schema, addConditions, query);
    return users;
  };

  async getUser(id, schema) {
    const conditions = { returnValues: 'name email google role img' }
    const user = await this.mongoDB.get(this.collection, schema, id, conditions, { status: true });
    return user || {};
  };

  async deleteUser(id, schema) {
    const user = await this.mongoDB.delete(this.collection, schema, id);
    return user || {};
  };

  async updateImg(id, schema, img) {

    if (!img) return { ok: false, message: 'Image not sent.' };

    const user = await this.getUser(id, schema);
    const values = Object.keys(user);

    if (user.id === config.invalidIdMessage) return { ok: false, message: 'Invalid id.' };
    if (values.length === 0) return { ok: false, message: 'Username does not exist.' };

    const infoFile = {
      newFile: img,
      oldFile: user.img,
      allowedExtensions: ['jpg', 'png', 'gif',],
    };

    const dataDestFolder = {
      destFolder: 'uploads',
      desTypeFolder: 'users',
    };
    const newImg = await this.filesLib.saveFile(infoFile, id, dataDestFolder);

    if (!newImg.ok) return { ok: false, message: newImg.message, };

    // Resize img user 300x200
    const resizeImg = await resizeImgs(newImg.path, 300, 200, 'jpg');
    newImg.nameFile = resizeImg.nameNewImg;
    await this.updateUser(id, { img: newImg.nameFile, modified: format(new Date(), 'dd-MM-yyyy') }, schema);

    return {
      ok: true,
      message: `The image ${img.name} has been updated successfully.`
    };
  };

  async getImage(nameImg) {
    const pathImg = path.resolve(__dirname, `../../uploads/users/${nameImg}`);
    const pathImgDefault = path.resolve(__dirname, `../assets/${config.imgDefaultName}`);
    if (!fs.existsSync(pathImg)) {
      return pathImgDefault;
    };

    return pathImg
  };

};

module.exports = {
  UsersService,
};