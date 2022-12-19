import { createStyles, Text } from "@mantine/core";
import React from "react";
import EmpyIcon from "./EmpyIcon";


const useStyles = createStyles((theme) => ({
	// create style to center the icon and text in the middle of the page
	main: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		height: "100%",
	},

}));

export const Empy = () => {
	const { classes } = useStyles();
	return (
		<div
			className={classes.main}
		>
			<EmpyIcon />
			<Text size="xl">
                Oops, there is nothing here yet.
            </Text>
		</div>
	);
};
