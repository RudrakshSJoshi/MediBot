/** @format */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { Toaster } from "react-hot-toast";
import axios from "axios";

//
const BACKEND_PORT = "8000";
//
axios.defaults.baseURL = `http://localhost:${BACKEND_PORT}/api`;
axios.defaults.withCredentials = true;

// console.log(BACKEND_PORT);

const theme = createTheme({
	typography: {
		fontFamily: "Roboto Slab, serif",
		allVariants: { color: "white" },
	},
});
ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<AuthProvider>
			<BrowserRouter>
				<ThemeProvider theme={theme}>
					<Toaster position="top-center" />
					<App />
				</ThemeProvider>
			</BrowserRouter>
		</AuthProvider>
	</React.StrictMode>
);
