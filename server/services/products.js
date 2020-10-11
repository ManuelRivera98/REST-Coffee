const { format } = require('date-fns');
const fs = require('fs');
const path = require('path');
// Libs
const { MongoLib } = require('../lib/mongo');
const { FilesLib } = require('../lib/files');
// Helpers
const { resizeImgs } = require('../utils/helpers/resizeImages');
// Conf
const { config } = require('../config');

class ProductService {
  constructor() {
    this.mongoDB = new MongoLib();
    this.collection = 'product';
    this.filesLib = new FilesLib();
  }

  async createProduct(data, schema, user_id) {
    const date = new Date();
    const newData = {
      ...data,
      user_id, img: config.imgDefaultName,
      created: format(date, 'dd-MM-yyyy'), modified: format(date, 'dd-MM-yyyy')
    };
    const product = await this.mongoDB.create(this.collection, schema, newData);
    return product;
  };

  async getProducts(schemas, conditions) {
    // Add values that we are to return
    const addConditions = {
      ...conditions,
      returnValues: 'name price user_id category_id img',
    };
    const { productSchema, userSchema, categorySchema, } = schemas;
    const dataPopulate = {
      collection: 'user',
      schema: userSchema,
      path: 'user_id',
    };

    const dataPopulate2 = {
      collection: 'category',
      schema: categorySchema,
      path: 'category_id',
    };

    const query = {
      status: true,
    };

    if (conditions.search) {
      const regex = new RegExp(conditions.search, 'i');
      query.name = regex;
    };

    const products = await this.mongoDB.getAll(this.collection, productSchema, addConditions, query, dataPopulate, dataPopulate2);
    return products;
  };

  async getProduct(id, schemas) {
    const { userSchema, categorySchema, productSchema } = schemas;
    const conditions = { returnValues: 'name price user_id category_id img' };
    const dataPopulate = {
      collection: 'user',
      schema: userSchema,
      path: 'user_id',
    };
    const dataPopulate2 = {
      collection: 'category',
      schema: categorySchema,
      path: 'category_id',
    };

    const product = await this.mongoDB.get(this.collection, productSchema, id, conditions, { status: true, }, dataPopulate, dataPopulate2);
    return product || {};
  };

  async updateProduct(id, data, schemas) {
    const { userSchema, categorySchema, productSchema } = schemas;
    const dataPopulate = {
      collection: 'user',
      schema: userSchema,
      path: 'user_id',
    };
    const dataPopulate2 = {
      collection: 'category',
      schema: categorySchema,
      path: 'category_id',
    };

    const addData = {
      ...data,
      modified: format(new Date(), 'dd-MM-yyyy'),
    }
    const product = await this.mongoDB.update(this.collection, productSchema, id, addData, { status: true }, dataPopulate, dataPopulate2);
    return product || {};
  };

  async removeProduct(id, schema) {
    const product = await this.mongoDB.delete(this.collection, schema, id);
    return product || {};
  };

  async updateImg(id, schemas, img) {

    if (!img) return { ok: false, message: 'Image not sent.' };

    const product = await this.getProduct(id, schemas);
    const values = Object.keys(product);

    if (product.id === config.invalidIdMessage) return { ok: false, message: 'Invalid id.' };
    if (values.length === 0) return { ok: false, message: 'product does not exist.' };

    const infoFile = {
      newFile: img,
      oldFile: product.img,
      allowedExtensions: ['jpg', 'png', 'gif',],
    };

    const dataDestFolder = {
      destFolder: 'uploads',
      desTypeFolder: 'products',
    };
    const newImg = await this.filesLib.saveFile(infoFile, id, dataDestFolder);

    if (!newImg.ok) return { ok: false, message: newImg.message, };

    // Resize img user 600x300
    const resizeImg = await resizeImgs(newImg.path, 600, 300, 'png');
    newImg.nameFile = resizeImg.nameNewImg;
    await this.updateProduct(id, { img: newImg.nameFile, modified: format(new Date(), 'dd-MM-yyyy') }, schemas);

    return {
      ok: true,
      message: `The image ${img.name} has been updated successfully.`
    };
  };

  async getImage(nameImg) {
    const pathImg = path.resolve(__dirname, `../../uploads/products/${nameImg}`);
    const pathImgDefault = path.resolve(__dirname, `../assets/${config.imgDefaultName}`);
    if (!fs.existsSync(pathImg)) {
      return pathImgDefault;
    };

    return pathImg
  };
};

module.exports = {
  ProductService,
};