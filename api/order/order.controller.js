const orderService = require('./order.service.js');

const logger = require('../../services/logger.service.js');

async function getOrders(req, res) {
  try {
    // console.log('req:', req);
    logger.debug('Getting Orders');
    const filterBy = {
      category: req.query.category || '',
    };
    const orders = await orderService.query(filterBy);
    res.json(orders);
  } catch (err) {
    logger.error('Failed to get orders', err);
    res.status(500).send({ err: 'Failed to get orders' });
  }
}

async function getOrderById(req, res) {
  try {
    const orderId = req.params.id;
    const order = await orderService.getById(orderId);
    res.json(order);
  } catch (err) {
    logger.error('Failed to get order', err);
    res.status(500).send({ err: 'Failed to get order' });
  }
}

async function addOrder(req, res) {
  const { loggedinUser } = req;
  try {
    const order = req.body;
    // Here we call the order service to add the order
    const addedOrder = await orderService.add(order);
    res.json(addedOrder);
  } catch (err) {
    logger.error('Failed to add order', err);
    res.status(500).send({ err: 'Failed to add order' });
  }
}

async function updateOrder(req, res) {
  try {
    const order = req.body;
    const updatedOrder = await orderService.update(order);
    res.json(updatedOrder);
  } catch (err) {
    logger.error('Failed to update order', err);
    res.status(500).send({ err: 'Failed to update order' });
  }
}

async function removeOrder(req, res) {
  try {
    console.log('req.params:', req.params);
    const orderId = req.params.id;
    const removedId = await orderService.remove(orderId);
    res.send(removedId);
  } catch (err) {
    logger.error('Failed to remove order', err);
    res.status(500).send({ err: 'Failed to remove order' });
  }
}

async function makePayment(req, res) {
  const { orderId, amount, currency, cardToken } = req.body;

  // Ensure the parameters are valid
  // Add your own validation here

  const secretKey = process.env.PAYME_SECRET_KEY;
  const md5Signature = createMd5Signature(orderId, amount, currency, secretKey);

  const payload = {
    orderId,
    amount,
    currency,
    md5Signature,
    cardToken,
  };

  try {
    const response = await axios.post('https://payme/api/v1/sale', payload);
    res.json(response.data);
  } catch (err) {
    res.status(500).json(err);
  }
}

async function tokenizeCard(req, res) {
  try {
    const cardDetails = req.body;
    const tokenizedCard = await orderService.tokenizeCard(cardDetails);
    res.json(tokenizedCard);
  } catch (err) {
    logger.error('Failed to tokenize card', err);
    res.status(500).send({ err: 'Failed to tokenize card' });
  }
}

module.exports = {
  getOrders,
  getOrderById,
  addOrder,
  updateOrder,
  removeOrder,
  makePayment,
  tokenizeCard,
};
