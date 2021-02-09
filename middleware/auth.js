const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
	// Get token from header
	const token = req.header('x-auth-token');

	// Check if there is no token
	if (!token) {
		// If no token, throw error with no token message
		return res.status(401).json({ msg: 'No token, authorization denied' });
	}

	// if there is a token...
	try {
		// ...use jsonwebtoken to verify the validity of token against the secret in the default.json config file
		const decoded = jwt.verify(token, config.get('jwtSecret'));
		// If verified, set the req.user of API route to decoded.user...
		req.user = decoded.user;
		// ...continue with current route
		next();
		// Otherwise, catch error and throw invalid token message
	} catch (err) {
		res.status(401).json({ msg: 'Token is not valid' });
	}
};
