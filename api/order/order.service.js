const dbService = require('../../services/db.service');
const logger = require('../../services/logger.service');
const utilService = require('../../services/util.service');
const ObjectId = require('mongodb').ObjectId;
const axios = require('axios');

async function query(filterBy = { category: '' }) {
  try {
    const criteria = {};

    if (filterBy.category) {
      criteria.category = { $regex: filterBy.category, $options: 'i' };
    }

    const collection = await dbService.getCollection('order');
    var orders = await collection.find(criteria).toArray();
    return orders;
  } catch (err) {
    logger.error('cannot find orders', err);
    throw err;
  }
}

async function getById(orderId) {
  try {
    const collection = await dbService.getCollection('order');
    const order = collection.findOne({ _id: ObjectId(orderId) });
    return order;
  } catch (err) {
    logger.error(`while finding order ${orderId}`, err);
    throw err;
  }
}

async function remove(orderId) {
  try {
    const collection = await dbService.getCollection('order');
    await collection.deleteOne({ _id: ObjectId(orderId) });
    return orderId;
  } catch (err) {
    logger.error(`cannot remove order ${orderId}`, err);
    throw err;
  }
}

async function add(order) {
  try {
    console.log('order:', order);
    const collection = await dbService.getCollection('order');
    await collection.insertOne(order);
    return order;
  } catch (err) {
    logger.error('cannot insert order', err);
    throw err;
  }
}

async function generateSale(order) {
  try {
    const sale = await axios.post(
      'https://sandbox.payme.io/api/generate-sale',
      order
    );
    return sale.data;
  } catch (err) {
    logger.error('Failed to generate sale', err);
    throw err;
  }
}

module.exports = {
  remove,
  query,
  getById,
  add,
  generateSale,
};
