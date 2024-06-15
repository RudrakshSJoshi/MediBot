/** @format */

import { TextField } from "@mui/material";

const CustomizedInput = (props) => {
	return (
		<TextField
			InputLabelProps={{ style: { color: "black", fontSize:"20px" } }}
			name={props.name}
			label={props.label}
			type={props.type}
			InputProps={{
				style: {
					width: "400px",
					borderRadius: 10,
					fontSize: 20,
					color: "white",
                    marginBottom:"24px",
				},
			}}
			autoComplete="off"
		/>
	);
};

export default CustomizedInput;
