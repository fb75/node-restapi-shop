const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/products');

router.get('/', (req, res, next) => {
	// .find() returns all data without args
	Product.find()
	.select('name price _id')
	.exec()
	.then(docs => {
		const response = {
			count: docs.length,
			products: docs.map(doc => {
				return {
					name: doc.price,
					price: doc.price,
					_id: doc._id,
					request: {
						type: 'GET',
						url: 'http://localhost:3000/products/' + doc._id
					}
				}
			})
		}
		console.log(docs); // [doc1, doc2, etc] or []
		res.status(200).json(response);
		// docs.length > 0 ? res.status(200).json(docs) : res.status(404).json({ message: '404 No docs founnd'});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});

router.post('/', (req, res, next) => {
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price
	});
	product.save().then(result => {
		console.log(result)
		res.status(201).json({
			message: '[POST /] - Product written on MongDb-Cloud ATLAS correctly...',
			createdProduct: {
				name: result.name,
				price: result.price,
				_id: result._id,
				request: {
					type: 'POST',
					url: 'http://localhost:3000/products/' + result._id 
				}
			}
		});
	})
	.catch(err => {
		res.status(500).json(
			{ 
				error: err
			}
		);
	});
});

router.get('/:productId', (req, res, next) => {
	const id = req.params.productId;
	Product.findById(id)
	.select('name price _id')
	.exec()
	.then(doc => {
		console.log('from database', doc);
		if(doc) {
			res.status(200).json({
				product: doc,
				request: {
					type: 'GET',
					url: 'htpp://localhost/products' + doc._id
				}
			});
			next();
		} else {
			res.status(404).json({
				message: '404 - ID not found'
			});
		}
	})
	.catch(err => {
		res.status(500).json({error: err});
	});
});

router.patch('/:productId', async (req, res, next) => {
	const id = req.params.productId;
	try {
		let updateProduct = await Product.updateOne({name: req.body.name});
		res.status(200).json({
			message: `[/PATCH Updated product id:${id} successfully]\`- lines updated on document:${updateProduct.n} lines updated`,
			updateProduct});
	} catch(err) {
		res.status(500).json({error: err})
	}
});

router.delete('/:productId', async (req, res, next) => {
	const id = req.params.productId;
	try {
		await Product.deleteOne({_id: id});
		res.status(200).json({
			messsage: `Product id:${id} deleted correctly...`
		});
	} catch(err) {
		res.status(500).json({
			error: err
		})
	}
});

module.exports = router;