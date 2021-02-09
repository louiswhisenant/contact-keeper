import axios from 'axios';

export const setAuthToken = (token) => {
	// If there is a token...
	if (token) {
		// ...set the default header ket 'x-auth-token' to value of token
		axios.defaults.headers.common['x-auth-token'] = token;
		// if there is no token...
	} else {
		// ...delete the token header from defaults
		delete axios.defaults.headers.common['x-auth-token'];
	}
};
