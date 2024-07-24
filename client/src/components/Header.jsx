/** @format */

import { AppBar, Toolbar } from "@mui/material";
import Logo from "./Logo";
import { useAuth } from "../contexts/AuthContext";
import Button from "@mui/material/Button"; // Import Button component from Material-UI
import { Link } from "react-router-dom"; // Assuming NavigationLink uses React Router Link

const Header = () => {
	const auth = useAuth();
	// console.log(auth);

	return (
		<AppBar
			sx={{
				bgcolor: "transparent",
				position: "static",
				boxShadow: "none",
			}}
		>
			<Toolbar sx={{ display: "flex" }}>
				<Logo />
				<div>
					{auth?.isLoggedIn ? (
						<>
							<Button
								component={Link}
								to="/chat"
								variant="contained"
								sx={{
									color: "green",
									backgroundColor: "white",
									fontSize: "17px",
									borderRadius: "13px",
									marginRight: "13px",
									padding: "4px 20px",
									"&:hover": {
										backgroundColor: "green",
										color: "white",
									},
								}}
							>
								Chat Now
							</Button>

							<Button
								component={Link}
                                to="/"
								variant="contained"
								sx={{
									color: "green",
									backgroundColor: "white",
									fontSize: "17px",
									borderRadius: "13px",
									marginRight: "13px",
									padding: "4px 20px",
									"&:hover": {
										backgroundColor: "green",
										color: "white",
									},
								}}
								onClick={auth.logout}
							>
								Logout
							</Button>
						</>
					) : (
						<>
							<Button
								component={Link}
								to="/login"
								variant="contained"
								sx={{
									color: "green",
									backgroundColor: "white",
									fontSize: "17px",
									borderRadius: "13px",
									marginRight: "13px",
									padding: "4px 20px",
									"&:hover": {
										backgroundColor: "green",
										color: "white",
									},
								}}
							>
								Login
							</Button>
							<Button
								component={Link}
								to="/signup"
								variant="contained"
								sx={{
									color: "green",
									backgroundColor: "white",
									fontSize: "17px",
									borderRadius: "13px",
									marginRight: "13px",
									padding: "4px 20px",
									"&:hover": {
										backgroundColor: "green",
										color: "white",
									},
								}}
							>
								Register
							</Button>
						</>
					)}
				</div>
			</Toolbar>
		</AppBar>
	);
};

export default Header;
