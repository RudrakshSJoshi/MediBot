/** @format */

import { Box, useMediaQuery, useTheme } from "@mui/material";
import TypingAnimation from "../components/TypingAnimation";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";

const Home = () => {
  const theme = useTheme();
  const isBelowMd = useMediaQuery(theme.breakpoints.down("md"));
  const [isVerticalLayout, setIsVerticalLayout] = useState(false);

  // Check window width on component mount and window resize
  useEffect(() => {
    const handleResize = () => {
      setIsVerticalLayout(window.innerWidth < 1300);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Box width={"100%"} height={"100%"}>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          mx: "auto",
          mt: 3,
        }}
      >
        <Box>
          <TypingAnimation />
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: isVerticalLayout ? "column" : "row",
            gap: 5,
            justifyContent: "center",
            my: 10,
          }}
        >
          <img
            className="move-up-down"
            src="Chat bot-amico.png"
            alt="robot"
            style={{ width: "350px", margin: "auto" }}
          />
          <img
            className="move-up-back"
            src="Innovation-amico.png"
            alt="robot"
            style={{ width: "500px", margin: "auto" }}
          />
          <img
            className="move-up-down"
			src="Mobile-bro.png"
            alt="robot"
            style={{ width: "350px", margin: "auto" }}
          />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Home;
