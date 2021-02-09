import React, { useState, useContext, useEffect } from 'react';
import ContactContext from '../../context/contact/contactContext';

export const ContactForm = () => {
	const contactContext = useContext(ContactContext);
	const { addContact, clearCurrent, updateContact, current } = contactContext;

	// When the component mounts, the contact to be set to the 'current' object, if it exists
	useEffect(() => {
		if (current !== null) {
			setContact(current);
			// and set to the default if 'current' does not exist
		} else {
			clearContactForm();
		}
	}, [contactContext, current]);

	// Default contact object
	const [contact, setContact] = useState({
		name: '',
		email: '',
		phone: '',
		type: 'personal',
	});

	// Contact destructuring
	const { name, email, phone, type } = contact;

	// Set contact object values back to default
	const clearContactForm = () => {
		setContact({
			name: '',
			email: '',
			phone: '',
			type: 'personal',
		});
	};

	// Edit contact object to match input values on change
	const onChange = (e) =>
		setContact({ ...contact, [e.target.name]: e.target.value });

	const onSubmit = (e) => {
		e.preventDefault();
		// If there is no current, the contact is new
		if (current === null) {
			// Add the new contact
			addContact(contact);
			// If there is current, the contact is being edited
		} else {
			// Update current contact
			updateContact(contact);
		}

		// Clear Current to reset edit state and forms
		clearAll();
	};

	const clearAll = () => {
		clearCurrent();
	};

	return (
		<form onSubmit={onSubmit}>
			<h2 className={current ? 'bg-warning' : 'text-primary'}>
				{current ? 'Edit Contact' : 'Add Contact'}
			</h2>
			<input
				type='text'
				placeholder='Name'
				name='name'
				value={name}
				onChange={onChange}
			/>
			<input
				type='email'
				placeholder='Email'
				name='email'
				value={email}
				onChange={onChange}
			/>
			<input
				type='text'
				placeholder='Phone Number'
				name='phone'
				value={phone}
				onChange={onChange}
			/>
			<h5>Contact Type</h5>
			<input
				type='radio'
				name='type'
				value='personal'
				checked={type === 'personal'}
				onChange={onChange}
			/>{' '}
			Personal{' '}
			<input
				type='radio'
				name='type'
				value='professional'
				checked={type === 'professional'}
				onChange={onChange}
			/>{' '}
			Professional{' '}
			<div>
				<input
					type='submit'
					value={current ? 'Edit Contact' : 'Add Contact'}
					className={`btn btn-block ${
						current ? 'btn-warning' : 'btn-primary'
					}
					`}
				/>
			</div>
			{current && (
				<div>
					<button
						className='btn btn-light btn-block'
						onClick={clearAll}>
						Cancel
					</button>
				</div>
			)}
		</form>
	);
};
