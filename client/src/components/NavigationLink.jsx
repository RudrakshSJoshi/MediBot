/** @format */

import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const NavigationLink = (props) => {
	return (
		<Link
			onClick={props.onClick}
			className="nav-link"
			to={props.to}
			style={{ background: props.bg, color: props.textColor }}
		>
			{props.text}
		</Link>
	);
};

// Define prop types for the NavigationLink component
NavigationLink.propTypes = {
	to: PropTypes.string,
	bg: PropTypes.string,
	text: PropTypes.string,
	textColor: PropTypes.string,
	onClick: PropTypes.func,
};

export default NavigationLink;
