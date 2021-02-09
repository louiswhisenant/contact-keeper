const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');
// Init express validator
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
// Require User model
const User = require('../models/User');

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post(
	'/',
	[
		check('name', 'Please include a name').not().isEmpty(),
		check('email', 'Please include a valid email address').isEmail(),
		check(
			'password',
			'Please enter a password with at least 6 characters'
		).isLength({ min: 6 }),
	],
	async (req, res) => {
		// Validate the request against the checks in the middleware above
		const errors = validationResult(req);
		// If the validation stores any errors in the errors const...
		if (!errors.isEmpty()) {
			// return a response with a bad request status and display the error(s)
			return res.status(400).json({ errors: errors.array() });
		}

		// If validated
		const { name, email, password } = req.body;

		try {
			// Search for already existing user using email
			let user = await User.findOne({ email });
			// If the user already exists, throw error
			if (user) {
				res.status(400).json({ msg: 'User already exists' });
			}
			// If the user is not found in db, initialize against User Schema with name, email, and password from the req.body
			user = new User({
				name,
				email,
				password,
			});

			// generate default bcrypt salt to hash user password
			const salt = await bcrypt.genSalt(10);

			user.password = await bcrypt.hash(password, salt);

			await user.save();

			// Init payload with user ID
			const payload = {
				user: {
					id: user.id,
				},
			};

			// Create jwt token for authentication
			jwt.sign(
				payload,
				// get secret from config default.json
				config.get('jwtSecret'),
				{
					// (optional) set expiration of token (24hrs)
					expiresIn: 86400,
				},
				(err, token) => {
					if (err) throw err;
					// If no error, respond with token to be stored in LS and authenticate user for the entire session/until expiration.
					res.json({ token });
				}
			);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

module.exports = router;
