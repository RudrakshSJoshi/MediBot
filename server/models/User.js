/** @format */

import mongoose from "mongoose";
import { randomUUID } from "crypto";

const ChatSchema = new mongoose.Schema({
	id: {
		type: String,
		default: randomUUID,
		required: true,
	},
	role: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
});

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	chats: [ChatSchema],
});

//In node JS always has a single instance of connection but in next js we have to exlusively specify the singleton connection
const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
