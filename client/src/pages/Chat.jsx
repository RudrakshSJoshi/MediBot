/** @format */

import { useState, useEffect, useRef } from "react";
import { Box, Avatar, Typography, Button, IconButton } from "@mui/material";
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

const Chat = () => {
	const navigate = useNavigate();
	const inputRef = useRef(null);
	const chatBoxRef = useRef(null);
	const auth = useAuth();
	const [chatMessages, setChatMessages] = useState([]);
	const [context, setContext] = useState({
		lastUserQuery: "The user hasn't yet asked a question",
		lastBotAnswer: "No answer, as user hasn't asked anything before",
		conversation_history: "",
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		const content = inputRef.current?.value;
		if (inputRef && inputRef.current) {
			inputRef.current.value = "";
		}
		const payload = {
			query: content,
			last_user_query: context.lastUserQuery,
			last_bot_answer: context.lastBotAnswer,
		}

		const newMessage = { role: "user", content };
		setChatMessages((prev) => [...prev, newMessage]);

		setContext((prev) => ({
			...prev,
			conversation_history: `${prev.conversation_history}User: ${content}\n`,
		}));

		const chatData = await sendChatRequest(payload);
		// console.log("Chat jsx  : chatData ", chatData);
		setChatMessages((prev) => [...prev, chatData]);

		// console.log("All the chat messages yet : ", chatMessages);
		setContext((prev) => ({ ...prev, lastUserQuery: content }));
		setContext((prev) => ({ ...prev, lastBotAnswer: chatData.content }));
		setContext((prev) => ({
			...prev,
			conversation_history: `${prev.conversation_history}MediBOT: ${chatData.content}\n`,
		}));
		// console.log("All Contexts are set");
	};

	const handleDeleteChats = async () => {
		try {
			toast.loading("Deleting Chats", { id: "deletechats" });
			await deleteUserChats();
			setChatMessages([]);
			setContext({
				lastUserQuery: "The user hasn't yet asked a question",
				lastBotAnswer: "No answer, as user hasn't asked anything before",
				prevAskedIngredients: "Not Asked Anything",
			});
			toast.success("Deleted Chats Successfully", { id: "deletechats" });
		} catch (error) {
			// console.log(error);
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
					// console.log(err);
					toast.error("Loading Failed", { id: "loadchats" });
				});
		}
	}, [auth]);

	useEffect(() => {
		if (chatBoxRef.current) {
			chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
		}
	}, [chatMessages]);

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
					variant="contained"
					sx={{
						width: "200px",
						bottom: "40px",
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
					onClick={() => auth.downloadChat(context.conversation_history)}
					>
					Download Chats
					</Button>

					<Button
						onClick={handleDeleteChats}
						sx={{
							width: "200px",
							bottom: "40px",
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
					backgroundColor: "rgba(0, 128, 0, 0.8)",
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
						userSelect: "none",
					}}
				>
					MediBot - Your Personal Healthcare Assistant
				</Typography>
				<Box
					ref={chatBoxRef}
					sx={{
						width: "100%",
						height: "60vh",
						borderRadius: 3,
						mx: "auto",
						display: "flex",
						flexDirection: "column",
						overflowY: "auto",
						scrollbarWidth: "none",
						"&::-webkit-scrollbar": {
							display: "none",
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
						onKeyDown={handleKeyDown}
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
