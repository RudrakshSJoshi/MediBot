/** @format */

import { Box, Typography, Button } from "@mui/material";
import CustomizedInput from "../components/CustomizedInput";
import { IoIosLogIn } from "react-icons/io";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
	const auth = useAuth();
	const navigate = useNavigate();
	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const name = formData.get("name");
		const email = formData.get("email");
		const password = formData.get("password");
		// console.log(email, password);

		try {
			toast.loading("Signing Up", { id: "signup" });
			await auth?.signup(name, email, password);
			toast.success("Registration Successfully", { id: "signup" });
			navigate("/");
		} catch (error) {
			// console.log(error);
			toast.error("Signup Failed", { id: "signup" });
		}
	};
	return (
		<Box width={"100%"} height={"100%"} display="flex" flex={1}>
			<Box
				padding={8}
				mt={8}
				display={{ md: "flex", sm: "none", xs: "none" }}
			>
				<img
					className="move-up-down"
					src="register1.png"
					alt="loginrobo"
					style={{ width: "405px" }}
				/>
			</Box>
			<Box
				marginRight={"50%"}
				display={"inline-flex"}
				flex={{ xs: 1, md: 0.5 }}
				justifyContent={"center"}
				alignItems={"center"}
				padding={2}
				ml={"auto"}
				mt={7}
			>
				<form
					onSubmit={handleSubmit}
					style={{
						margin: "auto",
						padding: "30px",
						boxShadow: "10px 10px 20px #000",
						borderRadius: "10px",
						border: "none",
						background: "linear-gradient(to bottom, green 20%, cyan 100%)",
					}}
				>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
						}}
					>
						<Typography
							variant="h4"
							textAlign="center"
							padding={2}
							fontWeight={600}
							color={"white"}
						>
							Register
						</Typography>
						<CustomizedInput type="text" name="name" label="Name"  />
						<CustomizedInput
							type="email"
							name="email"
							label="Email"
						/>
						<CustomizedInput
							type="password"
							name="password"
							label="Password"
						/>
						<Button
							type="submit"
							sx={{
								px: 2,
								py: 1,
								mt: 2,
								width: "400px",
								borderRadius: 2,
								bgcolor: "white",
								color: "green",
								fontSize: "15px",
								fontWeight: "bold",
								":hover": {
									bgcolor: "green",
									color: "white",
								},
							}}
							endIcon={<IoIosLogIn />}
						>
							Register
						</Button>
					</Box>
				</form>
			</Box>
		</Box>
	);
};

export default Signup;
