const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
// Init express validator
const { check, validationResult } = require('express-validator');
// Require User model
const User = require('../models/User');

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
	try {
		// Search for user in req.body after auth middleware has returned token, exempting password from res
		const user = await User.findById(req.user.id).select('-password');
		res.json(user);
	} catch (err) {
		// Throw server error
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
	}
});

// @route   POST api/auth
// @desc    Authenticate user and get token
// @access  Public
router.post(
	'/',
	[
		check('email', 'Email required').isEmail(),
		check('password', 'Password required').exists(),
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
		const { email, password } = req.body;

		try {
			// Search for user using email
			let user = await User.findOne({ email });
			// If the user doesn't exist, throw error
			if (!user) {
				res.status(400).json({ msg: 'Invalid credentials' });
			}

			// Init boolean that checks attempted login password against user stored password hash
			const isMatch = await bcrypt.compare(password, user.password);
			// If isMatch returns false, throw invalid credential error
			if (!isMatch) {
				return res.status(400).json({ msg: 'Invalid credentials' });
			}

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
