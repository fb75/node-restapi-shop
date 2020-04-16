const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// using multer for parsing formadata encoded bodies
const multer = require('multer');

// creating multer storage strategy 
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './uploads/');
	},
	filename: (req, file, cb) => {
		cb(null, new Date().toISOString() + file.originalname);
	}
});

const fileFilter = (req, file, cb) => {
	// reject file
	if(file.mimetype === 'image/jpeg' || image.mimetype === 'image/png') {
		cb(null, true);
	} else {
		cb(null, false);
	}
}

// const upload = multer({dest: '/uploads/'});
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5,
		fileFilter: fileFilter
	}
});

const Product = require('../models/products');

router.get('/', (req, res, next) => {
	// .find() returns all data without args
	Product.find()
	.select('name price _id productImage')
	.exec()
	.then(docs => {
		const response = {
			count: docs.length,
			products: docs.map(doc => {
				return {
					name: doc.name,
					price: doc.price,
					_id: doc._id,
					productImage: doc.productImage,
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

router.post('/', upload.single('productImage'), (req, res, next) => {
	console.log(req.file);
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price,
		productImage: req.file.path
	});
	product.save().then(result => {
		console.log(result)
		res.status(201).json({
			message: '[POST /] - Product written on MongDb-Cloud ATLAS correctly...',
			createdProduct: {
				name: result.name,
				price: result.price,
				_id: result._id,
				productImage: result.productImage,
				request: {
					type: 'POST',
					url: 'http://localhost:3000/products/' + result._id 
				}
			}
		});
	})
	.catch(err => {
		res.status(500).json({ 
				error: err
		});
	});
});

router.get('/:productId', (req, res, next) => {
	const id = req.params.productId;
	Product.findById(id)
	.select('name price _id productImage')
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
	try {
		await Product.deleteOne({_id: req.params.productId});
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