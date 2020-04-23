const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const mongoose = require('mongoose');

exports.users_get_me = async (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	try {
		const user = await User.findOne({email: email});
		if(user == null) {
			return res.status(404).json({
				message: '404 - User not found'
			})
		}
		const passwordsCheck = await bcrypt.compare(req.body.password, user.password);
		if(passwordsCheck) {
				return res.status(200).json({
					message: `User ${user.id} found.`,
					user,
					request: {
						type: 'GET',
						url: 'http://localhost/users/'
					}
				})		
	  } else {
  		return res.status(401).json({
				message: '401 - Unauthorized.'
	  	});
		} 
	} catch(err) {
		return res.status(404).json({
			message: '500 - Error occurred fetching user'
		})
	} 
};

exports.users_signup = async (req, res, next) => {
	try {
		const user = await User.find({email: req.body.email}).exec();
		const userName = await User.find({name: req.body.name}).exec();
	
		// user and userName are []
		if(userName.length > 0) return res.status(401).json({
			message: 'Name already in use.'
		});

		if(user.length == 0) {
			bcrypt.hash(req.body.password, 10, async (err, hash) => {
				if(err) {
					return res.status(500).json({
						error: err
					});
				} else {
					const user = new User({
							_id: new mongoose.Types.ObjectId(),
							name: req.body.name,
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
						return res.status(500).json({
							message: '500 - Internal server error'
						})
					};
				};		
			})
		} else {
			return res.status(409).json({
				message: 'Email already exists.',
			});
		};
	} catch(err) {
		return res.status(500).json({
			message: 'Error occurred fetching user.',
			error: err
		})
	}
};

exports.users_login = async (req, res, next) => {
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
					message: '200 - Auth successfull.',
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
		return res.status(400).json({
			message: '400 - Bad request.'
		})
	};
};

exports.users_delete_one = async (req, res, next) => {
	try {
		const user = await User.findOne({_id: req.params.userId});
		if(user != null) {
			try {
				await User.deleteOne({_id: req.params.userId});
				return res.status(200).json({
					messsage: `200 - User deleted successfully.`
				});
			} catch(err) {
				return res.status(500).json({
					message: '500 - Internal server error',
					error: err
				})
			}
		} else {
			return res.status(401).json({
				messsage: '400 - Bad request'
			})
		}
	} catch(err) {
		return res.status(400).json({
			message: '400 - Bad request'
		})
	} 
};