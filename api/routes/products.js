const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// using multer for parsing formadata encoded bodies
const multer = require('multer');
const Product = require('../models/products');
const productsController = require('../controllers/products');
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

router.get('/', productsController.products_get_all);
router.get('/:productId', productsController.products_get_one);	
router.post('/', checkAuth, upload.single('productImage'), productsController.products_post_one);
router.patch('/:productId', checkAuth, upload.single('productImage'), productsController.products_update_one);
router.delete('/:productId', checkAuth, productsController.products_delete_one);

module.exports = router;