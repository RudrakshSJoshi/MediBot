/** @format */

import User from "../models/User.js";

export const generateChatCompletion = async (req, res, next) => {
	const { role, content } = req.body;

	// console.log("Backend Mein Hai : ", role, content);
	try {
		const user = await User.findById(res.locals.jwtData.id);
		if (!user) {
			return res.status(401).json({
				message: "User not registered OR Token malfunctioned",
			});
		}
		// console.log("User To Mil Gaya");
		user.chats.push({ role: role, content: content });
		await user.save();
		// console.log(user.chats);
		return res.status(200).json({
			message:
				"Chat Generated Successfully and Saved to Database Successfully",
		});
	} catch {
		return res.status(500).json({
			message: "Chat Generated But Cannot Be Saved",
		});
	}
};
export const sendChatsToUser = async (req, res, next) => {
	try {
		//user token check
		// console.log(res.locals.jwtData.id);
		const user = await User.findById(res.locals.jwtData.id);
		if (!user) {
			return res
				.status(401)
				.send("User not registered OR Token malfunctioned");
		}
		if (user._id.toString() !== res.locals.jwtData.id) {
			return res.status(401).send("Permissions didn't match");
		}
		return res.status(200).json({ message: "OK", chats: user.chats });
	} catch (error) {
		// console.log(error);
		return res.status(200).json({ message: "ERROR", cause: error.message });
	}
};
export const deleteChats = async (req, res, next) => {
	try {
		//user token check
		const user = await User.findById(res.locals.jwtData.id);
		if (!user) {
			return res
				.status(401)
				.send("User not registered OR Token malfunctioned");
		}
		if (user._id.toString() !== res.locals.jwtData.id) {
			return res.status(401).send("Permissions didn't match");
		}
		//@ts-ignore
		user.chats = [];
		await user.save();
		return res.status(200).json({ message: "OK" });
	} catch (error) {
		// console.log(error);
		return res.status(200).json({ message: "ERROR", cause: error.message });
	}
};
