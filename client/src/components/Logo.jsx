/** @format */
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";

const Logo = () => {
    return (
        <div
            style={{
                display: "flex",
                marginRight: "auto",
                alignItems: "center",
                gap: "13px",
            }}
        >
            <Link to={"/"} style={{ borderRadius: "50%" }}>
                <img
                    src="chatbot_logo2.jpg"
                    alt="chatbot"
                    width={"70px"}
                    height={"70px"}
                    style={{ borderRadius: "50%" }}
                    className="image-inverted"
                />
            </Link>
            <Link to={"/"} style={{ textDecoration: "none" }}>
                <Typography
                    sx={{
                        display: { md: "block", sm: "none", xs: "none" },
                        mr: "auto",
                        fontWeight: "800",
                        textShadow: "0 0 10px black, 0 0 10px black, 0 0 10px black, 0 0 10px black",
                    }}
                >
                    <span style={{ fontSize: "24px" ,fontWeight: "bold" }}>MEDI</span>{" "}
                    <span style={{ fontSize: "18px" ,fontWeight: "bold" }}>BOT</span>
                </Typography>
            </Link>
        </div>
    );
};

export default Logo;
