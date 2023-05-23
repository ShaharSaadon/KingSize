const dbService = require('../../services/db.service');
const logger = require('../../services/logger.service');
const utilService = require('../../services/util.service');
const ObjectId = require('mongodb').ObjectId;

async function query(filterBy = { category: '' }) {
  try {
    console.log('filterBy:', filterBy);
    const criteria = {};

    if (filterBy.category) {
      criteria.category = { $regex: filterBy.category, $options: 'i' };
    }

    const collection = await dbService.getCollection('product');
    var products = await collection.find(criteria).toArray();
    return products;
  } catch (err) {
    logger.error('cannot find products', err);
    throw err;
  }
}

async function getById(productId) {
  try {
    const collection = await dbService.getCollection('product');
    const product = collection.findOne({ _id: ObjectId(productId) });
    return product;
  } catch (err) {
    logger.error(`while finding product ${productId}`, err);
    throw err;
  }
}

async function remove(productId) {
  try {
    const collection = await dbService.getCollection('product');
    await collection.deleteOne({ _id: ObjectId(productId) });
    return productId;
  } catch (err) {
    logger.error(`cannot remove product ${productId}`, err);
    throw err;
  }
}

async function add(product) {
  try {
    console.log('product:', product);
    const collection = await dbService.getCollection('product');
    await collection.insertOne(product);
    return product;
  } catch (err) {
    logger.error('cannot insert product', err);
    throw err;
  }
}

async function update(product) {
  try {
    const productToSave = {
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      sizes: product.sizes,
      colors: product.colors,
      imURL: product.imgURL,
    };
    const collection = await dbService.getCollection('product');
    await collection.updateOne(
      { _id: ObjectId(product._id) },
      { $set: productToSave }
    );
    return product;
  } catch (err) {
    logger.error(`cannot update product ${productId}`, err);
    throw err;
  }
}

async function addProductMsg(productId, msg) {
  try {
    msg.id = utilService.makeId();
    const collection = await dbService.getCollection('product');
    await collection.updateOne(
      { _id: ObjectId(productId) },
      { $push: { msgs: msg } }
    );
    return msg;
  } catch (err) {
    logger.error(`cannot add product msg ${productId}`, err);
    throw err;
  }
}

async function removeProductMsg(productId, msgId) {
  try {
    const collection = await dbService.getCollection('product');
    await collection.updateOne(
      { _id: ObjectId(productId) },
      { $pull: { msgs: { id: msgId } } }
    );
    return msgId;
  } catch (err) {
    logger.error(`cannot add product msg ${productId}`, err);
    throw err;
  }
}

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
  addProductMsg,
  removeProductMsg,
};
