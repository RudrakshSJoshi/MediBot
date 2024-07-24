/** @format */

import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
	checkAuthStatus,
	loginUser,
	logoutUser,
	signupUser,
} from "../helpers/api-communicator";
import axios from "axios";
import { saveAs } from 'file-saver';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState("");
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		//fetch is user cookies are valid and skip login page

		async function checkStatus() {
			const data = await checkAuthStatus();
			if (data) {
				setUser({ email: data.email, name: data.name });
				setIsLoggedIn(true);
			}
		}

		checkStatus();
	}, []);

	const login = async (email, password) => {
		const data = await loginUser(email, password);
		// console.log(data);
		if (data) {
			setUser({ email: data.email, name: data.name });
			setIsLoggedIn(true);
		}
	};
	const logout = async () => {
		await logoutUser();
		setUser("");
		setIsLoggedIn(false);
		window.location.reload();
	};
	const signup = async (name, email, password) => {
		const data = await signupUser(name, email, password);
		if (data) {
			setUser({ email: data.email, name: data.name });
			setIsLoggedIn(true);
		}
	};

	const downloadChat = (conversationHistory) => {
		const blob = new Blob([conversationHistory], { type: 'text/plain;charset=utf-8' });
		saveAs(blob, 'chat_history.txt');
	};

	const value = {
		user,
		isLoggedIn,
		login,
		logout,
		signup,
		downloadChat,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};

// Define prop types for the AuthProvider component
AuthProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
