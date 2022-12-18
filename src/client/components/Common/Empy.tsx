import { Text } from "@mantine/core";
import React from "react";
import EmpyIcon from "./EmpyIcon";

export const Empy = () => {
	return (
		<div>
			<EmpyIcon />
			<Text size="xl">
                Oops, there is nothing here yet.
            </Text>
		</div>
	);
};
