/** @format */

import express from "express";
import cors from "cors";
import { config } from "dotenv";
import morgan from "morgan";
import router from "./routes/index.js";
import { connectToDatabase } from "./db/connection.js";
import cookieParser from "cookie-parser";
config();
const app = express();

//middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
//Cookie Parser used to send cookies from server to client to be used in authentication
app.use(cookieParser(process.env.COOKIE_SECRET));

//used only in development mode
app.use(morgan("dev"));

app.use("/api", router);

//database connection
const PORT = process.env.PORT || 5000;
connectToDatabase()
	.then(() => {
		//connections

		app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
	})
	.catch((error) => console.error("Error connecting to database: ", error));
