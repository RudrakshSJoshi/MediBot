/** @format */

import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";

export const createToken = (user) => {
	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: "30d",
	});

	return token;
};

export const verifyToken = async (req, res, next) => {
	const token = req.signedCookies[`${COOKIE_NAME}`];
	if (!token || token.trim() === "") {
		return res.status(401).json({ message: "Token Not Recieved" });
	}
	// console.log("Token Manager: ",token);
	return new Promise((resolve, reject) => {
		return jwt.verify(token, process.env.JWT_SECRET, (err, success) => {
			if (err) {
				reject(res.message);
				return res.status(401).json({ message: "Token Expired" });
			} else {
				// console.log("Token Verification Successfull");
				resolve();
				res.locals.jwtData = success;
				return next();
			}
		});
	});
};
