import {
	createStyles,
	Header,
	Group,
	Button,
	Text,
	Box,
	Burger,
	Drawer,
	ScrollArea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
	hiddenMobile: {
		[theme.fn.smallerThan("sm")]: {
			display: "none",
		},
	},

	hiddenDesktop: {
		[theme.fn.largerThan("sm")]: {
			display: "none",
		},
	},
}));

export function LinkYHeader() {
	const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
		useDisclosure(false);
	const { classes } = useStyles();

	const router = useRouter();

	return (
		<Box>
			<Header height={60} px="md">
				<Group position="apart" sx={{ height: "100%" }}>
					<Text weight="bold" size="lg" component={Link} href="/">
						LinkYBase
					</Text>
					<Group className={classes.hiddenMobile}>
						<Button onClick={() => router.push("/auth")} color="teal">
							{" "}
							Get started
						</Button>
					</Group>

					<Burger
						opened={drawerOpened}
						onClick={toggleDrawer}
						className={classes.hiddenDesktop}
					/>
				</Group>
			</Header>

			<Drawer
				opened={drawerOpened}
				onClose={closeDrawer}
				size="100%"
				padding="md"
				className={classes.hiddenDesktop}
				zIndex={1000000}
			>
				<ScrollArea sx={{ height: "calc(100vh - 60px)" }} mx="-md" p="md">
					<Button
						color="teal"
						fullWidth={true}
						onClick={() => router.push("/auth")}
					>
						Get started
					</Button>
				</ScrollArea>
			</Drawer>
		</Box>
	);
}
