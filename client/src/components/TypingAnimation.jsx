/** @format */

import { TypeAnimation } from "react-type-animation";

const TypingAnimation = () => {
    return (
        <TypeAnimation
            sequence={[
                "Connect with Your Health AI",
                500,
                "Empower Your Health Journey",
                500,
                "Your Personal Health Companion",
                500,
            ]}
            speed={70}
            style={{
                fontSize: "40px",
                fontWeight: "bold",
                color: "white",
                display: "inline-block",
                textAlign: "center",
                textShadow: "0 0 10px green, 0 0 10px green, 0 0 10px green, 0 0 10px green",
                userSelect: "none", // Disable user selection
            }}
            repeat={Infinity}
        />
    );
};

export default TypingAnimation;
