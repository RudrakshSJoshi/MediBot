/** @format */

import { Box, Avatar, Typography } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import PropTypes from "prop-types";

function extractCodeFromString(message) {
	if (message.includes("```")) {
		const blocks = message.split("```");
		return blocks;
	}
	return [message]; // Return the message as a single block if no code blocks are found
}

function isCodeBlock(str) {
	if (
		str.includes("=") ||
		str.includes(";") ||
		str.includes("[") ||
		str.includes("]") ||
		str.includes("{") ||
		str.includes("}") ||
		str.includes("#") ||
		str.includes("//")
	) {
		return true;
	}
	return false;
}

const ChatItem = ({ content, role }) => {
	const auth = useAuth();
	const messageBlocks = extractCodeFromString(content);

	return role === "assistant" ? (
		<Box
			sx={{
				display: "flex",
				p: 2,
				bgcolor: "rgb(139, 69, 19, 0.4)",
				gap: 2,
				borderRadius: 2,
				my: 1,
			}}
		>
			<Avatar sx={{ ml: "0" }}>
				<img src="chatbots.png" alt="openai" width={"50px"} />
			</Avatar>
			<Box>
				{messageBlocks &&
					messageBlocks.length &&
					messageBlocks.map((block, index) =>
						isCodeBlock(block) ? (
							<SyntaxHighlighter
								style={coldarkDark}
								language="javascript"
								key={index}
							>
								{block}
							</SyntaxHighlighter>
						) : (
							<pre key={index} style={{ margin: 0 }}>
								<Typography
									sx={{
										fontSize: "20px",
										whiteSpace: "pre-wrap",
									}}
								>
									{block}
								</Typography>
							</pre>
						)
					)}
			</Box>
		</Box>
	) : (
		<Box
			sx={{
				display: "flex",
				p: 2,
				bgcolor: "rgb(139, 69, 139, 0.4)",
				gap: 2,
				borderRadius: 2,
			}}
		>
			<Avatar sx={{ ml: "0", bgcolor: "black", color: "white" }}>
				{auth?.user?.name && auth.user.name[0]}
				{auth?.user?.name &&
					auth.user.name.split(" ")[1] &&
					auth.user.name.split(" ")[1][0]}
			</Avatar>
			<Box>
				{messageBlocks &&
					messageBlocks.length &&
					messageBlocks.map((block, index) =>
						isCodeBlock(block) ? (
							<SyntaxHighlighter
								style={coldarkDark}
								language="javascript"
								key={index}
							>
								{block}
							</SyntaxHighlighter>
						) : (
							<pre key={index} style={{ margin: 0 }}>
								<Typography
									sx={{
										fontSize: "20px",
										whiteSpace: "pre-wrap",
									}}
								>
									{block}
								</Typography>
							</pre>
						)
					)}
			</Box>
		</Box>
	);
};

ChatItem.propTypes = {
	content: PropTypes.string,
	role: PropTypes.string,
};

export default ChatItem;
