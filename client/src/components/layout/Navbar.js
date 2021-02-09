import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';
import ContactContext from '../../context/contact/contactContext';

export const Navbar = ({ title, icon }) => {
	const authContext = useContext(AuthContext);
	const contactContext = useContext(ContactContext);

	const { isAuthenticated, logoutUser, user } = authContext;
	const { clearContacts } = contactContext;

	const onLogout = () => {
		logoutUser();
		clearContacts();
	};

	const authLinks = (
		<Fragment>
			<li>
				<a href='#!' onClick={onLogout}>
					<i className='fas fa-sign-out-alt'></i>{' '}
					<span className='hide-sm'>
						Logout <em>{user && user.name}</em>
					</span>
				</a>
			</li>
		</Fragment>
	);

	const guestLinks = (
		<Fragment>
			<li>
				<Link to='/register'>Register</Link>
			</li>
			<li>
				<Link to='/login'>Login</Link>
			</li>
		</Fragment>
	);

	return (
		<div className='navbar bg-primary'>
			<h1>
				<Link to='/'>
					<i className={icon} /> {title}
				</Link>
			</h1>
			<ul>
				<li>
					<Link to='/'>Home</Link>
				</li>
				<li>
					<Link to='/about'>About</Link>
				</li>
				{isAuthenticated ? authLinks : guestLinks}
			</ul>
		</div>
	);
};

Navbar.propTypes = {
	title: PropTypes.string.isRequired,
	icon: PropTypes.string,
};

Navbar.defaultProps = {
	title: 'Contact Keeper',
	icon: 'fas fa-id-card-alt',
};