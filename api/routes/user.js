const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/signup', async (req, res, next) => {
	try {
		const user = await User.find({email: req.body.email}).exec();
		// user is an []
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
			message: 'Error occurred fetching user.',
			error: err
		})
	}
});

router.post('/login', async (req, res, next) => {
	try {
		const user = await User.findOne({email: req.body.email});
		if(user != null) {
			const passwordsCheck = await bcrypt.compare(req.body.password, user.password);
			if(passwordsCheck) {
				const token =	jwt.sign(
					{
						email: user.email,
						userId: user._id
					}, 
					process.env.JWT_KEY,
					{
						expiresIn: "1h"
					}
			  );
				return res.status(200).json({
					message: '200 - Auth ok.',
					token: token
				});
			} else {
				return res.status(401).json({
					message: '401 - Unauthorized.'
				})
			}
		} else {
			return res.status(401).json({
				message: '401 - Unauthorized'
			})
		}
	} catch(err) {
		return res.status(401).json({
			message: '401 - Something went wrong.'
		})
	};
});

router.delete('/:userId', async (req, res, next) => {
	try {
		const user = await User.findOne({_id: req.params.userId});
		if(user) {
			try {
				await User.deleteOne({_id: req.params.userId});
				res.status(200).json({
					messsage: `200 - User deleted correctly.`
				});
			} catch(err) {
				res.status(500).json({
					message: '500 - Error occurred deleting user',
					error: err
				})
			}
		}
	} catch(err) {
		return res.status(404).json({
			message: '400 - Bad request'
		})
	} 
});


module.exports = router;