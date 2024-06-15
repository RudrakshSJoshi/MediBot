/** @format */

import { Router } from "express";
import userRouter from "./userRoute.js";
import chatRouter from "./chatRoute.js";

const router = Router();

router.use("/user", userRouter); // [domain]/api/user

router.use("/chat", chatRouter); // [domain]/api/chats

export default router;
