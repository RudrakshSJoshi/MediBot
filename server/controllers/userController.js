/** @format */

import User from "../models/User.js";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/tokenManager.js";
import { COOKIE_NAME } from "../utils/constants.js";

const getAllUsers = async (req, res) => {
	try {
		//getting all users
		const user = await User.find();
		return res.status(200).json({ message: "Changa", user });
	} catch (error) {
		// console.log(error.message);
		return res.status(200).json({ message: "GDBD", cause: error.message });
	}
};

const userSignup = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		// console.log(password)
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(401).send({ message: "User already exists" });
		}
		const hashedPassword = await hash(password, 10);
		// console.log(hashedPassword);
		const user = new User({ name, email, password: hashedPassword });
		await user.save();
		//cookies added
		res.clearCookie(COOKIE_NAME, {
			httpOnly: true,
			signed: true,
			domain: "localhost",
		});
		const token = createToken(user);
		const expires = new Date();
		expires.setDate(expires.getDate() + 30);
		console.log(token);
		res.cookie(COOKIE_NAME, token, {
			path: "/",
			domain: "localhost",
			expires,
			httpOnly: true,
			signed: true,
		});
		// console.log(user);
		res.status(201).json({
			message: "User Created Successfully",
			name: user.name,
			email: user.email,
		});
	} catch (error) {
		// console.log(error.message);
		res.status(200).json({
			message: "Failed to create user",
			cause: error.message,
		});
	}
};

const userLogin = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).send("User Not Registered");
		}
		const isPasswordCorrect = await compare(password, user.password);
		if (!isPasswordCorrect) {
			return res.status(401).send("Invalid Credentials");
		}
		res.clearCookie(COOKIE_NAME, {
			httpOnly: true,
			signed: true,
			domain: "localhost",
		});
		const token = createToken(user);
		const expires = new Date();
		expires.setDate(expires.getDate() + 30);
		// console.log(token);
		res.cookie(COOKIE_NAME, token, {
			path: "/",
			domain: "localhost",
			expires,
			httpOnly: true,
			signed: true,
		});

		res.status(200).json({
			message: "User Logged In Successfully",
			name: user.name,
			email: user.email,
		});
	} catch (error) {
		// console.log(error.message);
		res.status(200).json({
			message: "Failed to login user",
			cause: error.message,
		});
	}
};

const verifyUser = async (req, res) => {
	try {
		const user = await User.findById(res.locals.jwtData.id);
		// console.log("userController tak to aaya");
		if (!user) {
			return res
				.status(401)
				.send("User Not Registered or Token Malfunctioned");
		}
		// console.log(user);
		if (user._id.toString() !== res.locals.jwtData.id) {
			return res.status(401).send("Token Not matched with correct user");
		}
		// console.log(user._id.toString(), res.locals.jwtData.id);

		res.status(200).json({
			message: "User Logged In Successfully",
			name: user.name,
			email: user.email,
		});
	} catch (error) {
		// console.log(error.message);
		res.status(200).json({
			message: "Failed to login user",
			cause: error.message,
		});
	}
};

const userLogout = async(req, res)=>{
	try{
		const user = await User.findById(res.locals.jwtData.id);
		if(!user){
			return res.status(401).send("User Not Registered or Token Malfunctioned");
		}
		if(user._id.toString() !== res.locals.jwtData.id){
			return res.status(401).send("Token Not matched with correct user");
		}
		res.clearCookie(COOKIE_NAME, {
			httpOnly: true,
			signed: true,
			domain: "localhost",
		});
		res.status(200).json({message: "User Logged Out Successfully"});
	}catch(error){
		// console.log(error.message);
		res.status(200).json({
			message: "Failed to logout user",
			cause: error.message,
		});
	}

}

export { getAllUsers, userSignup, userLogin, verifyUser, userLogout };
