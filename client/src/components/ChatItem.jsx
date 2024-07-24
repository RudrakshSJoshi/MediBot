/** @format */

import { Box, Avatar, Typography } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import PropTypes from "prop-types";

// Custom markdown renderer for code blocks
const CodeBlock = ({ language, value }) => {
  return (
    <SyntaxHighlighter
      style={coldarkDark}
      language={language}
      customStyle={{ color: 'white' }} // Set code block text color to white
    >
      {value}
    </SyntaxHighlighter>
  );
};

// Custom markdown renderer for all other elements
const MarkdownComponents = {
  p: ({ node, ...props }) => (
    <Typography
      sx={{
        fontSize: "20px",
        whiteSpace: "pre-wrap",
        color: "white", // Set paragraph text color to white
      }}
      {...props}
    />
  ),
  strong: ({ node, ...props }) => (
    <Typography
      component="span"
      sx={{
        fontSize: "20px",
        whiteSpace: "pre-wrap",
        color: "white", // Set bold text color to white
        // fontWeight: "bold" // Ensure bold font weight
      }}
      {...props}
    />
  ),
  // Add other elements as needed
  h1: ({ node, ...props }) => (
    <Typography
      variant="h4"
      sx={{
        color: "white", // Set header text color to white
      }}
      {...props}
    />
  ),
  h2: ({ node, ...props }) => (
    <Typography
      variant="h5"
      sx={{
        color: "white", // Set header text color to white
      }}
      {...props}
    />
  ),
  h3: ({ node, ...props }) => (
    <Typography
      variant="h6"
      sx={{
        color: "white", // Set header text color to white
      }}
      {...props}
    />
  ),
  ul: ({ node, ...props }) => (
    <ul style={{ color: 'white', fontSize: "17px" }} {...props} /> // Set list text color to white
  ),
  ol: ({ node, ...props }) => (
    <ol style={{ color: 'white' }} {...props} /> // Set ordered list text color to white
  ),
  li: ({ node, ...props }) => (
    <li style={{ color: 'white' }} {...props} /> // Set list item text color to white
  ),
  // Add other elements as needed
};

const ChatItem = ({ content, role }) => {
  const auth = useAuth();

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
        <ReactMarkdown
          components={{
            ...MarkdownComponents,
            code: CodeBlock,
          }}
        >
          {content}
        </ReactMarkdown>
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
        <ReactMarkdown
          components={{
            ...MarkdownComponents,
            code: CodeBlock,
          }}
        >
          {content}
        </ReactMarkdown>
      </Box>
    </Box>
  );
};

ChatItem.propTypes = {
  content: PropTypes.string,
  role: PropTypes.string,
};

export default ChatItem;