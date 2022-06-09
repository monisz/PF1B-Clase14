const express = require('express');

const routerProducts = require('./products');
const routerCart = require('./cart');
const router = express.Router();

router.use('/api/productos', routerProducts);
router.use('/api/carrito', routerCart);

module.exports = router;