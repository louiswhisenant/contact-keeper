const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
// Init express validator
const { check, validationResult } = require('express-validator');
// Require User model
const User = require('../models/User');
// Require Contact model
const Contact = require('../models/Contact');

// @route   GET api/contacts
// @desc    Get all users contacts
// @access  Private
router.get('/', auth, async (req, res) => {
	try {
		// Find all contacts whose user value matches the current authorized user, and sort by name (Alphabetical Order) into contacts array
		const contacts = await Contact.find({ user: req.user.id }).sort({
			name: 1,
		});

		res.json(contacts);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
	}
});

// @route   POST api/contacts
// @desc    Add new contact
// @access  Private
router.post(
	'/',
	[auth, [check('name', 'Name is required').not().isEmpty()]],
	async (req, res) => {
		// Validate the request against the checks in the middleware above
		const errors = validationResult(req);

		// If the validation stores any errors in the errors const...
		if (!errors.isEmpty()) {
			// return a response with a bad request status and display the error(s)...
			return res.status(400).json({ errors: errors.array() });
		}

		// ...otherwise...
		const { name, email, phone, type } = req.body;

		try {
			const newContact = new Contact({
				name,
				email,
				phone,
				type,
				user: req.user.id,
			});

			const contact = await newContact.save();
			res.json(contact);
		} catch (err) {
			console.error(err.message);
			res.status(500).json({ msg: 'Server Error' });
		}
	}
);

// @route   PUT api/contacts/:id
// @desc    Update contact
// @access  Private
router.put('/:id', auth, async (req, res) => {
	const { name, email, phone, type } = req.body;

	// Build contact object
	const contactFields = {};
	if (name) contactFields.name = name;
	if (email) contactFields.email = email;
	if (phone) contactFields.phone = phone;
	if (type) contactFields.type = type;

	try {
		// Search contacts for contact with id matching the params in the req
		let contact = await Contact.findById(req.params.id);

		// If the contact from req.params does not exist, return 404
		if (!contact)
			return res.status(404).json({ json: 'Contact not found' });

		// Make sure user has requested contact's priviledges
		if (contact.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'Not authorized' });
		}
		// set the contact values to those passed in req.body
		contact = await Contact.findByIdAndUpdate(
			req.params.id,
			{ $set: contactFields },
			{ new: true }
		);

		res.json(contact);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
	}
});

// @route   DELETE api/contacts/:id
// @desc    Delete contact
// @access  Private
router.delete('/:id', auth, async (req, res) => {
	try {
		// Search contacts for contact with id matching the params in the req
		let contact = await Contact.findById(req.params.id);
		// If the contact from req.params does not exist, return 404
		if (!contact)
			return res.status(404).json({ json: 'Contact not found' });

		// Make sure user has requested contact's priviledges
		if (contact.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'Not authorized' });
		}

		await Contact.findByIdAndRemove(req.params.id);

		res.json({ msg: 'Contact removed' });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
	}
});

module.exports = router;
