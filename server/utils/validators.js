/** @format */

import { body, validationResult } from "express-validator";

const validate = (validations) => {
	return async (req, res, next) => {
		// sequential processing, stops running validations chain if one fails.
		for (let validation of validations) {
			const result = await validation.run(req);
			if (!result.isEmpty()) {
				break;
			}
		}
		const errors = validationResult(req);
		if (errors.isEmpty()) {
			return next();
		}
		return res.status(400).json({ errors: errors.array() });
	};
};

const loginValidator = [
	body("email").trim().isEmail().withMessage("Email is required"),
	body("password")
		.trim()
		.isLength({ min: 6 })
		.withMessage("Password must be atleast 6 characters long"),
];

const signupValidator = [
	body("name").notEmpty().withMessage("Name is required"),
	...loginValidator,
];

const chatCompletionValidator = [
	body("content").notEmpty().withMessage("Message is required"),
];

export { validate, signupValidator, loginValidator,  chatCompletionValidator};
