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
		await axios.post("http://localhost:5000/reset");
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

	

	const downloadChat = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.get("http://localhost:5000/download", {
				responseType: "blob", // Important to get the response as a Blob
			});

			// Create a link element
			const url = window.URL.createObjectURL(new Blob([res.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", `${user.name} Chats`); // Set the file name

			// Append to the document
			document.body.appendChild(link);

			// Trigger the download
			link.click();

			// Clean up and remove the link
			link.parentNode.removeChild(link);
		} catch (error) {
			console.error("Error downloading the file:", error);
		}
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
