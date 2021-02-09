import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AlertContext from '../../context/alert/alertContext';
import AuthContext from '../../context/auth/authContext';

export const Login = (props) => {
	const [user, setUser] = useState({
		email: '',
		password: '',
	});

	const alertContext = useContext(AlertContext);
	const authContext = useContext(AuthContext);

	const { setAlert } = alertContext;
	const { loginUser, error, clearErrors, isAuthenticated } = authContext;

	const { email, password } = user;

	useEffect(() => {
		if (isAuthenticated) {
			props.history.push('/');
		}
		// Change to if error ? set Alert to error message?
		if (error) {
			setAlert(error, 'danger');
			clearErrors();
		}
		// eslint-disable-next-line
	}, [error, isAuthenticated, props.history]);

	const onChange = (e) => {
		setUser({ ...user, [e.target.name]: e.target.value });
	};

	const onSubmit = (e) => {
		e.preventDefault();

		if (email === '' || password === '') {
			setAlert('Please fill in all fields', 'danger');
		} else {
			loginUser({ email, password });
		}
	};

	return (
		<div className='form-container'>
			<h1>
				Account <span className='text-primary'>Login</span>
			</h1>
			<form onSubmit={onSubmit}>
				<div className='form-group'>
					<label htmlFor='email'>Email</label>
					<input
						type='email'
						name='email'
						value={email}
						onChange={onChange}
					/>
				</div>
				<div className='form-group'>
					<label htmlFor='password'>Password</label>
					<input
						type='password'
						name='password'
						value={password}
						onChange={onChange}
					/>
				</div>
				<input
					type='submit'
					value='Login'
					className='btn btn-primary btn-block'
					onSubmit={onSubmit}
				/>
				<small>
					New User? Sign up <Link to='/register'>here</Link>
				</small>
			</form>
		</div>
	);
};
