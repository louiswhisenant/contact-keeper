import React, { Fragment, useContext, useEffect } from 'react';
import ContactContext from '../../context/contact/contactContext';
import { Spinner } from '../layout/Spinner';
import { ContactItem } from './ContactItem';

export const Contacts = () => {
	const contactContext = useContext(ContactContext);

	const { contacts, filtered, loading, getContacts } = contactContext;

	useEffect(() => {
		getContacts();
		// eslint-disable-next-line
	}, []);

	// Define items as filtered if filtered exists, else contacts
	let items;
	filtered !== null ? (items = filtered) : (items = contacts);

	if (contacts !== null && contacts.length === 0 && !loading) {
		return (
			<h2 className='text-grey'>
				You have no contacts. Fill out the form to add a new contact.
			</h2>
		);
	}

	return (
		<Fragment>
			{contacts !== null && !loading ? (
				items.map((contact) => (
					<ContactItem key={contact._id} contact={contact} />
				))
			) : (
				<Spinner />
			)}
		</Fragment>
	);
};
