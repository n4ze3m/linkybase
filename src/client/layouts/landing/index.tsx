import { AppShell } from "@mantine/core";
import React from "react";
import { LinkYHeader } from "./header";

interface IProps {
	children: React.ReactNode;
}

export const LandingLayout = ({ children }: IProps) => {
	return <AppShell header={<LinkYHeader />}>{children}</AppShell>;
};
