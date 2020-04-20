const Product = require('../models/products');

const mongoose = require('mongoose');



exports.products_get_all = async (req, res, next) => {
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
};

exports.products_get_one = async (req, res, next) => {
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
};

exports.products_update_one = async (req, res, next) => {
	const id = req.params.productId;
	console.log(id);
	try {
		const updatedProduct = await Product.findOneAndUpdate({"_id": id}, { $set: {	
			name: req.body.name, 
			price: req.body.price, 
			productImage: req.file.path
		}}, {new: false}).exec();
		return res.status(200).json({product: {
			name: updatedProduct.name,
			price: updatedProduct.price,
			productImage: updatedProduct.productImage
		},
			request: {
				type: 'GET',
				url: 'http://localhost:3000/products/' + id
			}
		})			
	} catch(err) {
		return res.status(500).json({error: err})
	}
};

exports.products_delete_one = async (req, res, next) => {
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
};

exports.products_post_one = async (req, res, next) => {
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
				name: product.name,
				price: product.price,
				_id: product._id,
				productImage: product.productImage,
				request: {
					type: 'GET',
					url: 'http://localhost:3000/products/' 
				}
			}
		});
	} catch(err) {
		return res.status(500).json({ 
				messsage: '500 - Internal server error',
				error: err
		});
	}
};