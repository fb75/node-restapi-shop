const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/orders');

router.get('/', (req, res, next) => {
	res.status(200).json({
		message: 'Orders were fetched!'
	})
});

router.post('/', async (req, res, next) => {
	// creating new Order from Order model 
	const order = new Order({
		// if invoked as a function .ObcjectId() returns new _id
		_id: mongoose.Types.ObjectId(),
		quantity: req.body.quantity,
		product: req.body.productId 
	});
	try {
		await order.save();
		res.status(201).json({
			message: 'Orders were posted!',
			order: order
		});
	} catch(err) {
		res.status(500).json({
			error: err
		})
	}
});


router.get('/:orderId', (req, res, next) => {
	// 201: resource fetched succesfully
	res.status(200).json({
		message: `Order id fetched!`,
		orderId: req.params.orderId
	})
});

router.delete('/:orderId', (req, res, next) => {
	// 201: resource fetched succesfully
	res.status(200).json({
		message:'Order id deleted!',
		orderId: req.params.orderId
	})
});


module.exports = router;