/** @format */

import { useState, useEffect, useRef } from "react";
import { Box, Avatar, Typography, Button, IconButton } from "@mui/material";
// import red from "@mui/material/colors/red";
import { useAuth } from "../contexts/AuthContext";
import ChatItem from "../components/ChatItem";
import { IoMdSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {
	deleteUserChats,
	getUserChats,
	sendChatRequest,
} from "../helpers/api-communicator";
import toast from "react-hot-toast";
import axios from "axios";

const Chat = () => {
	const navigate = useNavigate();
	const inputRef = useRef(null);
	const chatBoxRef = useRef(null); // Ref to hold reference to the chat box container
	const auth = useAuth();
	const [chatMessages, setChatMessages] = useState([]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const content = inputRef.current?.value;
		if (inputRef && inputRef.current) {
			inputRef.current.value = "";
		}
		const newMessage = { role: "user", content };
		setChatMessages((prev) => [...prev, newMessage]);
		const chatData = await sendChatRequest(content);
		setChatMessages((prev) => [...prev, chatData]);
	};

	const handleDeleteChats = async () => {
		try {
			toast.loading("Deleting Chats", { id: "deletechats" });
			await deleteUserChats();
			setChatMessages([]);
			await axios.post("http://localhost:5000/reset");
			toast.success("Deleted Chats Successfully", { id: "deletechats" });
		} catch (error) {
			console.log(error);
			toast.error("Deleting chats failed", { id: "deletechats" });
		}
	};

	useEffect(() => {
		if (auth?.isLoggedIn && auth.user) {
			toast.loading("Loading Chats", { id: "loadchats" });
			getUserChats()
				.then((data) => {
					setChatMessages([...data.chats]);
					toast.success("Successfully loaded chats", {
						id: "loadchats",
					});
				})
				.catch((err) => {
					console.log(err);
					toast.error("Loading Failed", { id: "loadchats" });
				});
		}
	}, [auth]);

	useEffect(() => {
		if (chatBoxRef.current) {
			chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
		}
	}, [chatMessages]); // Scroll to bottom whenever chatMessages change

	useEffect(() => {
		if (!auth?.user) {
			return navigate("/login");
		}
	}, [auth, navigate]);

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			handleSubmit(e);
		}
	};

	return (
		<Box
			sx={{
				display: "flex",
				flex: 1,
				width: "100%",
				height: "100%",
				mt: 3,
				gap: 3,
			}}
		>
			<Box
				sx={{
					display: { md: "flex", xs: "none", sm: "none" },
					flex: 0.2,
					flexDirection: "column",
				}}
			>
				<Box
					sx={{
						display: "flex",
						width: "100%",
						height: "60vh",
						bgcolor: "#3E2723",
						borderRadius: 5,
						flexDirection: "column",
						opacity: "0.9",
						mx: 3,
					}}
				>
					<Avatar
						sx={{
							mx: "auto",
							my: 2,
							bgcolor: "white",
							color: "black",
							fontWeight: 700,
						}}
					>
						{auth?.user?.name && auth.user.name[0]}
						{auth?.user?.name &&
							auth.user.name.split(" ")[1] &&
							auth.user.name.split(" ")[1][0]}
					</Avatar>
					<Typography
						sx={{
							mx: "auto",
							fontFamily: "work sans",
							textAlign: "center",
						}}
					>
						You are talking to an AI Health Chatbot
					</Typography>
					<Typography
						sx={{
							mx: "auto",
							fontFamily: "work sans",
							my: 4,
							p: 3,
						}}
					>
						You can ask various questions related to health and get
						a structured and optimal solution
					</Typography>
					<Button
						onClick={handleDeleteChats}
						sx={{
							width: "200px",
							my: "auto",
							color: "white",
							fontWeight: "700",
							borderRadius: 3,
							mx: "auto",
							bgcolor: "brown",
							":hover": {
								bgcolor: "white",
								color: "brown",
							},
						}}
					>
						Clear Conversation
					</Button>
				</Box>
			</Box>
			<Box
				sx={{
					display: "flex",
					flex: { md: 0.8, xs: 1, sm: 1 },
					flexDirection: "column",
					px: 3,
					backgroundColor: "rgba(0, 128, 0, 0.8)", // Adjust the RGB values and opacity as desired
					borderRadius: "20px",
					marginRight: "5px",
					marginLeft: "5px",
				}}
			>
				<Typography
					sx={{
						fontSize: "30px",
						color: "white",
						mb: 2,
						mx: "auto",
						fontWeight: "800",
						textShadow: "0 2px 2px black",
						userSelect: "none", // Disable user selection
					}}
				>
					MediBot - Your Personal Healthcare Assistant
				</Typography>
				<Box
					ref={chatBoxRef} // Assign ref to the chat box container
					sx={{
						width: "100%",
						height: "60vh",
						borderRadius: 3,
						mx: "auto",
						display: "flex",
						flexDirection: "column",
						overflowY: "auto", // Enable vertical scrolling
						scrollbarWidth: "none", // Firefox
						"&::-webkit-scrollbar": {
							display: "none", // Hide scrollbar for Chrome, Safari, and Edge
						},
						scrollBehavior: "smooth",
					}}
				>
					{chatMessages.map((chat, index) => (
						<ChatItem
							content={chat.content}
							role={chat.role}
							key={index}
						/>
					))}
				</Box>
				<div
					style={{
						width: "calc(100%)",
						borderRadius: "10px",
						backgroundColor: "white",
						display: "flex",
						margin: "auto",
						marginBottom: "5px",
					}}
				>
					<input
						ref={inputRef}
						type="text"
						onKeyDown={handleKeyDown} // Add the onKeyDown event listener
						style={{
							width: "100%",
							backgroundColor: "transparent",
							padding: "20px",
							border: "none",
							outline: "none",
							color: "green",
							fontWeight: "bold",
							fontSize: "20px",
						}}
					/>
					<IconButton
						onClick={handleSubmit}
						sx={{ color: "green", mx: 1 }}
					>
						<IoMdSend />
					</IconButton>
				</div>
			</Box>
		</Box>
	);
};

export default Chat;
