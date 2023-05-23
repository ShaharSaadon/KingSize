const productService = require('./product.service.js');

const logger = require('../../services/logger.service.js');

async function getProducts(req, res) {
  try {
    // console.log('req:', req);
    logger.debug('Getting Products');
    const filterBy = {
      category: req.query.category || '',
    };
    const products = await productService.query(filterBy);
    res.json(products);
  } catch (err) {
    logger.error('Failed to get products', err);
    res.status(500).send({ err: 'Failed to get products' });
  }
}

async function getProductById(req, res) {
  try {
    const productId = req.params.id;
    const product = await productService.getById(productId);
    res.json(product);
  } catch (err) {
    logger.error('Failed to get product', err);
    res.status(500).send({ err: 'Failed to get product' });
  }
}

async function addProduct(req, res) {
  const { loggedinUser } = req;
  try {
    const product = req.body;
    const addedProduct = await productService.add(product);
    res.json(addedProduct);
  } catch (err) {
    logger.error('Failed to add product', err);
    res.status(500).send({ err: 'Failed to add product' });
  }
}

async function updateProduct(req, res) {
  try {
    const product = req.body;
    const updatedProduct = await productService.update(product);
    res.json(updatedProduct);
  } catch (err) {
    logger.error('Failed to update product', err);
    res.status(500).send({ err: 'Failed to update product' });
  }
}

async function removeProduct(req, res) {
  try {
    const productId = req.params.id;
    const removedId = await productService.remove(productId);
    res.send(removedId);
  } catch (err) {
    logger.error('Failed to remove product', err);
    res.status(500).send({ err: 'Failed to remove product' });
  }
}

// async function addProductMsg(req, res) {
//   const { loggedinUser } = req;
//   try {
//     const productId = req.params.id;
//     const msg = {
//       txt: req.body.txt,
//       by: loggedinUser,
//     };
//     const savedMsg = await productService.addProductMsg(productId, msg);
//     res.json(savedMsg);
//   } catch (err) {
//     logger.error('Failed to update product', err);
//     res.status(500).send({ err: 'Failed to update product' });
//   }
// }

// async function removeProductMsg(req, res) {
//   const { loggedinUser } = req;
//   try {
//     const productId = req.params.id;
//     const { msgId } = req.params;

//     const removedId = await productService.removeProductMsg(productId, msgId);
//     res.send(removedId);
//   } catch (err) {
//     logger.error('Failed to remove product msg', err);
//     res.status(500).send({ err: 'Failed to remove product msg' });
//   }
// }

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  removeProduct,
  // addProductMsg,
  // removeProductMsg,
};
