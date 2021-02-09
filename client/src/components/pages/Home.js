import React, { useContext, useEffect } from 'react';
import { ContactFilter } from '../contacts/ContactFilter';
import { ContactForm } from '../contacts/ContactForm';
import { Contacts } from '../contacts/Contacts';
import AuthContext from '../../context/auth/authContext';

export const Home = () => {
	// Init context
	const authContext = useContext(AuthContext);

	// Destructure authContext variables
	const { loadUser } = authContext;

	// Once component loads, run loadUser from AuthState to validate the user
	useEffect(() => {
		loadUser();
		// eslint-disable-next-line
	}, []);

	return (
		<div className='grid-2'>
			<div>
				<ContactForm />
			</div>
			<div>
				<ContactFilter />
				<Contacts />
			</div>
		</div>
	);
};
