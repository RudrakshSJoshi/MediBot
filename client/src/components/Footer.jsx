/** @format */

import { Link } from "react-router-dom";

const Footer = () => {
	return (
		<footer>
			<div
				style={{
					width: "100%",
					minHeight: "20vh",
					maxHeight: "30vh",
					marginTop: 0,
				}}
			>
				<p
					style={{
						fontWeight: "bold",
						fontSize: "20px",
						textAlign: "center",
						padding: "20px",
						color: "white",
						textShadow: "0 0 2px black, 0 0 2px black",
						userSelect: "none",
					}}
				>
					Built By:
					<span
						style={{
							fontSize: "25px",
							fontWeight: "bold",
							color: "white",
							textShadow: "0 0 5px green, 0 0 5px green",
							userSelect: "none",
						}}
						className="nav-link"
					>
						Pratham & Rudraksh
					</span>
					🍃
				</p>
			</div>
		</footer>
	);
};

export default Footer;
