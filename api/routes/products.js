const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/products');
// using multer for parsing formadata encoded bodies
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

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

router.get('/', async (req, res, next) => {
	try {
		const products = await Product.find().select('name price _id productImage').exec();
		if(products.length >= 1) {
			const response = {
				count: products.length,
				products: products.map(product => {
					return {
						name: product.name,
						price: product.price,
						_id: product._id,
						productImage: product.productImage,
						request: {
							type: 'GET',
							url: 'http://localhost:3000/products/' + product._id
						}
					}
				})
			}
			return res.status(200).json({message: '200 - Products found.', response});
		} else {
			return res.status(404).json({messsage: '404 - Not Found.'});
		}
	} catch(err) {
		return res.status(500).json({messsage: '500 - Internal server error.'});
	};
});
	

router.post('/', checkAuth, upload.single('productImage'), async (req, res, next) => {
	try {
		const product = new Product({
			_id: new mongoose.Types.ObjectId(),
			name: req.body.name,
			price: req.body.price,
			productImage: req.file.path
		});	
		await product.save();
		return res.status(201).json({
			message: '200 - Product saved correctly...',
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
	} catch(err) {
		return res.status(500).json({ 
				messsage: '500 - Internal server error',
				error: err
		});
	}
});



router.get('/:productId', async (req, res, next) => {
	try {
		const product = await Product.findById(req.params.productId).select('name price _id productImage');
		if(product != null) {
			return res.status(200).json({
				product: product,
				request: {
					type: 'GET',
					url: 'htpp://localhost/products/' + product._id
				}
			});
		} else {
			return res.status(404).json({
				messsage: '404 - Product not found.'
			})
		};
	} catch(err) {
		return res.status(500).json({
			messsage: '500 - Internal server error'
		})
	};
});

router.patch('/:productId', checkAuth, async (req, res, next) => {
	const id = req.params.productId;
	try {
		let updateProduct = await Product.updateOne({name: req.body.name});
		return res.status(200).json({
			message: `200 - Updated product id:${id} successfully]\`- lines updated on document:${updateProduct.n} lines updated`,
			updateProduct});
	} catch(err) {
		return res.status(500).json({error: err})
	}
});

router.delete('/:productId', checkAuth, async (req, res, next) => {
	const id = req.params.productId;
	try {
		let product = await Product.deleteOne({_id: id});
		console.log(product);
		if(product) {
			return res.status(200).json({
				messsage: `Product id:${id} deleted correctly...`
			});
		}
	} catch(err) {
		return res.status(500).json({
			error: err
		})
	}
});

module.exports = router;