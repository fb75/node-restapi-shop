const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Order = require('../models/orders');
const ordersController = require('../controllers/orders');
const Product = require('../models/products');

router.get('/', checkAuth, ordersController.orders_get_all);
router.get('/:orderId', checkAuth, ordersController.orders_get_orderId);
router.post('/', checkAuth, ordersController.orders_post_order);
router.patch('/:orderId', checkAuth, ordersController.orders_update_order);
router.delete('/:orderId', ordersController.orders_delete_order);

module.exports = router;