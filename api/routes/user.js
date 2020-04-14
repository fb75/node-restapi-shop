const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

router.post('/signup', async (req, res, next) => {
	try {
		const user = await User.find({email: req.body.email}).exec();
		if(user.length == 0) {
			bcrypt.hash(req.body.password, 10, async (err, hash) => {
				if(err) {
					return res.status(500).json({
						error: err
					});
				} else {
					const user = new User({
							_id: new mongoose.Types.ObjectId(),
							email: req.body.email,
							password: hash 
						});
					try {
						await user.save();
						return res.status(201).json({
							message: '200 - User created and saved successfully',
							user
						});
					} catch(err) {
						res.status(400).json({
							message: '400 - Bad request'
						})
					};
				};		
			})
		} else {
			return res.status(422).json({
				message: 'Email already exists.',
			});
		};
	} catch(err) {
		res.status(500).json({
			message: 'Error occurred fetching user',
			error: err
		})
	}
})


module.exports = router;