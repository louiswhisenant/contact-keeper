import React, { useContext, useRef, useEffect } from 'react';
import ContactContext from '../../context/contact/contactContext';

export const ContactFilter = () => {
	// Init contactContext
	const contactContext = useContext(ContactContext);
	// Destructure contactContext
	const { filterContacts, clearFilterContacts, filtered } = contactContext;

	const text = useRef('');

	useEffect(() => {
		if (filtered === null) {
			text.current.value = '';
		}
	});

	const onChange = (e) => {
		if (text.current.value !== '') {
			filterContacts(e.target.value);
		} else {
			clearFilterContacts();
		}
	};

	return (
		<form>
			<input
				type='text'
				ref={text}
				placeholder='Filter Contacts...'
				onChange={onChange}
			/>
		</form>
	);
};
