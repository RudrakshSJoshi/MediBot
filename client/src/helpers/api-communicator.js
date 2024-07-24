/** @format */

import axios from "axios";

export const loginUser = async (email, password) => {
	const res = await axios.post("/user/login", { email, password });
	if (res.status !== 200) {
		throw new Error(
			"Unable to Login the User from Client Side.....200/400 gdbd"
		);
	}
	const data = await res.data;
	// console.log(data);
	return data;
};

export const checkAuthStatus = async () => {
	const res = await axios.get("/user/auth-status");
	// console.log(res);
	if (res.status !== 200) {
		throw new Error(
			"Unable to Login the User from Client Side.....200/400 gdbd"
		);
	}
	const data = await res.data;
	// console.log(data);
	return data;
};

export const logoutUser = async () => {
	const res = await axios.get("/user/logout");
	if (res.status !== 200) {
		throw new Error(
			"Unable to Logout the User from Client Side.....200/400 gdbd"
		);
	}
	const data = await res.data;
	// console.log(data);
	return data;
};

export const signupUser = async (name, email, password) => {
	const res = await axios.post("/user/signup", { name, email, password });
	if (res.status !== 201) {
		throw new Error(
			"Unable to Signup the User from Client Side.....200/400 gdbd"
		);
	}
	const data = await res.data;
	// console.log(data);
	return data;
};

// export const sendChatRequest = async (message) => {
// 	const res = await axios.post("/chat/new", { message });
// 	if (res.status !== 200) {
// 		throw new Error("Unable to send chat");
// 	}
// 	const data = await res.data;
// 	return data;
// };

export const sendChatRequest = async (message) => {
	// console.log("From Frontend pass to api communicator : ", message);
	const res = await axios.post(
		"http://localhost:5000/detect",
		message,
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
	// console.log("Model ka response : ", res);
	if (res.status !== 200) {
		throw new Error("Unable to send chat from Model");
	}
	const modelMessage = { role: "assistant", content: res.data.response };
	const userMessage = { role: "user", content: message.query };
	// console.log(modelMessage);
	// console.log(userMessage);

	const userResponse = await axios.post("/chat/new", userMessage);
	// console.log("User Message has been saved in backend");
	const response = await axios.post("/chat/new", modelMessage);

	if (response.status !== 200 || userResponse.status !== 200) {
		throw new Error("Unable to send chat");
	}
	return modelMessage;
};

export const getUserChats = async () => {
	const res = await axios.get("/chat/all-chats");
	if (res.status !== 200) {
		throw new Error("Unable to send chat");
	}
	const data = await res.data;
	return data;
};

export const deleteUserChats = async () => {
	const res = await axios.delete("/chat/delete");
	if (res.status !== 200) {
		throw new Error("Unable to delete chats");
	}
	const data = await res.data;
	return data;
};
