/** @format */
import { connect, disconnect } from "mongoose";

const connectToDatabase = async () => {
	try {
		await connect(process.env.MONGODB_URI);
		// console.log("Connected to database");
	} catch (error) {
		// console.error("Error connecting to database: ", error);
	}
};

const disconnectFromDatabase = async () => {
	try {
		await disconnect();
		// console.log("Disconnected from database");
	} catch (error) {
		// console.error("Error disconnecting from database: ", error);
	}
};

export { connectToDatabase, disconnectFromDatabase };
