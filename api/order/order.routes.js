const express = require('express');
const {
  requireAuth,
  requireAdmin,
} = require('../../middlewares/requireAuth.middleware');
const { log } = require('../../middlewares/logger.middleware');
const {
  getOrders,
  getOrderById,
  addOrder,
  updateOrder,
  removeOrder,
  makePayment,
  tokenizeCard,
} = require('./order.controller');
const router = express.Router();

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getOrders);
router.get('/:id', getOrderById);
router.post('/', addOrder);
router.post('/pay', makePayment);
router.post('/card', tokenizeCard);
router.delete('/:id', removeOrder);
router.put('/:id', requireAuth, requireAdmin, updateOrder);

// router.delete('/:id', requireAuth, removeProduct);
// router.delete('/:id', removeProduct);
// router.post('/:id/msg', requireAuth, addProductMsg);
// router.delete('/:id/msg/:msgId', requireAuth, removeProductMsg);

module.exports = router;
