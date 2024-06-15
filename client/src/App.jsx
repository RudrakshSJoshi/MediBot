/** @format */
import Header from "./components/Header";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import { useAuth } from "./contexts/AuthContext";

const App = () => {
	const auth = useAuth();
	return (
		<main>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				{auth?.isLoggedIn && auth.user && (
					<Route path="/chat" element={<Chat />} />
				)}
				<Route path="*" element={<NotFound />} />
			</Routes>
		</main>
	);
};

export default App;
