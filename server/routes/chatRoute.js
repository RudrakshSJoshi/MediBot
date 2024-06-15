/** @format */

import { Router } from "express";
import { verifyToken } from "../utils/tokenManager.js";
import { chatCompletionValidator, validate } from "../utils/validators.js";
//hai kuch aur imports controllers mein se
import {
	generateChatCompletion,
	sendChatsToUser,
	deleteChats,
} from "../controllers/chatController.js";

const chatRouter = Router();
chatRouter.post(
	"/new",
	validate(chatCompletionValidator),
	verifyToken,
	generateChatCompletion
);
chatRouter.get("/all-chats", verifyToken, sendChatsToUser);
chatRouter.delete("/delete", verifyToken, deleteChats);

export default chatRouter;
