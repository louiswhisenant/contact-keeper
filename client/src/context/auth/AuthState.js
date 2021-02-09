import React, { useReducer } from 'react';
import axios from 'axios';
import AuthContext from './authContext';
import authReducer from './authReducer';
import { setAuthToken } from '../../utils/setAuthToken';
import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	USER_LOADED,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
	CLEAR_ERRORS,
} from '../types';

const AuthState = (props) => {
	const initialState = {
		token: localStorage.getItem('token'),
		isAuthenticated: null,
		loading: true,
		error: null,
		user: null,
	};

	const [state, dispatch] = useReducer(authReducer, initialState);

	// Load User
	const loadUser = async () => {
		if (localStorage.token) {
			setAuthToken(localStorage.token);
		}

		try {
			const res = await axios.get('/api/auth');

			dispatch({ type: USER_LOADED, payload: res.data });
		} catch (err) {
			dispatch({ type: AUTH_ERROR });
		}
	};

	// Register User
	// Create an async function to register the user, passing the form data to the function
	const registerUser = async (formData) => {
		// Init a config object with a headers obj inside that contains the content-type value
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		try {
			// await the response from the post request to users, passing the form data and the headers
			const res = await axios.post('/api/users', formData, config);

			// if successful, disptach res(validation token) to the reducer
			dispatch({ type: REGISTER_SUCCESS, payload: res.data });

			loadUser();
		} catch (err) {
			dispatch({ type: REGISTER_FAIL, payload: err.response.data.msg });
		}
	};

	// Login User
	const loginUser = async (formData) => {
		// Init a config object with a headers obj inside that contains the content-type value
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		try {
			// await the response from the post request to users, passing the form data and the headers
			const res = await axios.post('/api/auth', formData, config);

			// if successful, disptach res(validation token) to the reducer
			dispatch({ type: LOGIN_SUCCESS, payload: res.data });

			loadUser();
		} catch (err) {
			dispatch({ type: LOGIN_FAIL, payload: err.response.data.msg });
		}
	};

	// Logout User
	const logoutUser = () => {
		dispatch({ type: LOGOUT });
	};

	// Clear Errors
	const clearErrors = () => {
		dispatch({ type: CLEAR_ERRORS });
	};

	return (
		<AuthContext.Provider
			value={{
				token: state.token,
				isAuthenticated: state.isAuthenticated,
				loading: state.loading,
				error: state.error,
				user: state.user,
				loadUser,
				registerUser,
				loginUser,
				logoutUser,
				clearErrors,
			}}>
			{props.children}
		</AuthContext.Provider>
	);
};

export default AuthState;
