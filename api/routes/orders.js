const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Order = require('../models/orders');
const Product = require('../models/products');

router.get('/', checkAuth, async (req, res, next) => {
	try {
		const orders = await Order.find().select('product quantity _id').populate('product', 'name');
		res.status(200).json({
			count: orders.length,
			orders: orders.map(order => {
				return {
					_id: order._id,
					product: order.product,
					quantity: order.quantity,
					request: {
						type: 'GET',
						url: 'http://localhost:3000/orders/' + order._id
					}
				};
			})
		});
	} catch(err) {
		res.status(500).json({error: err})
	};
});

router.post('/', checkAuth, async (req, res, next) => {
	try {
		product = await Product.findById(req.body.productId);
		console.log('product found: ' + product);
	} catch(err) {
			res.status(500).json({
			message: '500 - Unable to get pruductId.'
		})
	}
	// creating new Order from Order model 
	const order = new Order({
		// if invoked as a function .ObcjectId() returns new _id
		_id: mongoose.Types.ObjectId(),
		quantity: req.body.quantity,
		product: product 
	});
	try {
		await order.save();
		res.status(201).json({
			message: '201 - Order created correctly.',
			order: order
		});
	} catch(err) {
		res.status(500).json({
			message: '500 - Error occurred saving order.',
			error: err
		})
	};
});

router.get('/:orderId', checkAuth, async (req, res, next) => {
	const id = req.params.orderId;
	try {
		let order = await Order.findById({_id: id}).select('_id product quantity').populate('product');
		if(!order) {
			return res.status(404).json({
				message: '404 - Order not found'
			})
		}
		return res.status(200).json({
			message: `Order ${id} fetched correctly.`,
			order,
			request: {
				type: 'GET',
				url: 'http://localhost/orders/'
			}
		})
	} catch(err) {
		return res.status(404).json({
			message: '500 - Error occurred fetching order',
			error: err
		})
	}
});

router.delete('/:orderId', async (req, res, next) => {
	const id = req.params.orderId;
	try {
		let order = await Order.deleteOne({_id: id});
		return res.status(200).json({
			messsage: `200 - Order id:${id} deleted correctly...`,
			request: {
				type: 'POST',
				url: 'http://localhost:3000/orders/'
			}
		});
	} catch(err) {
		return res.status(500).json({
			message: '500 - Error occurred deleting order'
		});
	};
});

router.put('/:orderId', checkAuth, async (req, res, next) => {
	const id = req.params.orderId;
	try {
		let updatedOrder = await Order.updateOne({quantity: req.body.quantity, product: req.body.product});
		return res.status(200).json({
			message: `200 - Order ${id} updated successfully`,
			order: {
				_id: updatedOrder._id,
				product: updatedOrder.product,
				quantity: updatedOrder.quantity
			}
		});
	} catch(err) {
		return res.status(500).json({
			message: '500 - Error occurred when updating order',
			error: err
		})
	}
});

module.exports = router;