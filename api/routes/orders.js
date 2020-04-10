const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.status(200).json({
		message: 'Orders were fetched!'
	})
});

router.post('/', (req, res, next) => {
	const order = {
		productId: req.body.productId,
		quantity: req.body.quantity
	}
	// 201: resource fetched succesfully
	res.status(201).json({
		message: 'Orders were posted!',
		order: order
	})
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