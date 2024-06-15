import { Router } from "express";
import { getAllUsers, userLogin, userLogout, userSignup, verifyUser } from "../controllers/userController.js";
import { loginValidator, signupValidator, validate } from "../utils/validators.js";
import { verifyToken } from "../utils/tokenManager.js";

const userRouter = Router();

//adding a middleware to authenticate and check if the enties like name, email and password are valid
userRouter.get("/", getAllUsers)
userRouter.post("/signup", validate(signupValidator), userSignup)
userRouter.post("/login", validate(loginValidator), userLogin)
userRouter.get("/auth-status",verifyToken, verifyUser)
userRouter.get("/logout",verifyToken, userLogout)


export default userRouter;