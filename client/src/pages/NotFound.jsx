/** @format */

import { useEffect } from "react";

const NotFound = () => {
	useEffect(() => {
		const formatThousandsNoRounding = (n) => {
			return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
		};

		let hasRun = false;

		const onEnter = () => {
			if (!hasRun) {
				const numbers = document.querySelectorAll(".number");
				numbers.forEach((number) => {
					const countTo = parseInt(
						number.getAttribute("data-count"),
						10
					);

					const animateCount = () => {
						const duration = 2000;
						const stepTime = Math.abs(
							Math.floor(duration / countTo)
						);
						let start = 0;
						const end = countTo;
						const timer = setInterval(() => {
							start += 1;
							number.textContent =
								formatThousandsNoRounding(start);
							if (start === end) clearInterval(timer);
						}, stepTime);
					};

					animateCount();
				});
				hasRun = true;
			}
		};

		onEnter();
	}, []);

	const styles = {
		container: {
			width: "100%",
			height: "100%",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			fontFamily: '"Roboto Mono", "Liberation Mono", Consolas, monospace',
			color: "black",
			backgroundSize: "cover",
			backgroundRepeat: "no-repeat",
			minHeight: "100vh",
			minWidth: "100vw",
		},
		number: {
			fontSize: "4rem",
			fontWeight: 500,
			marginBottom: "1rem",
			textAlign: "center",
		},
		text: {
			fontWeight: 300,
			textAlign: "center",
		},
	};

	return (
		<div style={styles.container}>
			<div id="countUp" style={styles.countUp}>
				<div className="number" data-count="404" style={styles.number}>
					0
				</div>
				<div className="text" style={styles.text}>
					Page not found
				</div>
				<div className="text" style={styles.text}>
					This may not mean anything.
				</div>
				<div className="text" style={styles.text}>
					I&apos;m probably working on something that has blown up.
				</div>
			</div>
		</div>
	);
};

export default NotFound;
