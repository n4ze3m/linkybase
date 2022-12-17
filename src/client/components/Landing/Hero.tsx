import { createStyles, Container, Text, Button, Group } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { useRouter } from "next/router";
import { Feature } from "./Feature";

const BREAKPOINT = "@media (max-width: 755px)";

const useStyles = createStyles((theme) => ({
	wrapper: {
		position: "relative",
		minHeight: 700,
		paddingBottom: 10,
		backgroundColor:
			theme.colorScheme === "dark"
				? theme.colors.dark[8]
				: theme.colors.gray[1],
		boxSizing: "border-box",
	},

	inner: {
		position: "relative",
		paddingBottom: 80,
		paddingTop: 80,

		[BREAKPOINT]: {
			paddingBottom: 80,
			paddingTop: 80,
		},
	},

	title: {
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,
		fontSize: 62,
		fontWeight: 900,
		lineHeight: 1.1,
		margin: 0,
		padding: 0,
		color: theme.colorScheme === "dark" ? theme.white : theme.black,

		[BREAKPOINT]: {
			fontSize: 42,
			lineHeight: 1.2,
		},
	},

	description: {
		marginTop: theme.spacing.xl,
		fontSize: 24,

		[BREAKPOINT]: {
			fontSize: 18,
		},
	},

	controls: {
		marginTop: theme.spacing.xl * 2,

		[BREAKPOINT]: {
			marginTop: theme.spacing.xl,
		},
	},

	control: {
		height: 54,
		paddingLeft: 38,
		paddingRight: 38,

		[BREAKPOINT]: {
			height: 54,
			paddingLeft: 18,
			paddingRight: 18,
			flex: 1,
		},
	},
}));

export function Hero() {
	const { classes } = useStyles();

	const router = useRouter();

	return (
		<div className={classes.wrapper}>
			<Container size={900} className={classes.inner}>
				<h1 className={classes.title}>
					Manage your{" "}
					<Text
						component="span"
						variant="gradient"
						gradient={{ from: "green", to: "teal" }}
						inherit
					>
						{" "}
						links{" "}
					</Text>{" "}
					easily{" "}
					<Emoji size={42} unified="1f517" emojiStyle={EmojiStyle.APPLE} />
				</h1>

				<Text className={classes.description} color="dimmed">
					Linkybase is a free and open source web app that allows you to manage
					your links in one place. Collect, organize, and share your links with
					your friends and family.
				</Text>

				<Group className={classes.controls}>
					<Button
						size="xl"
						className={classes.control}
						variant="gradient"
						gradient={{ from: "green", to: "teal" }}
						onClick={() => router.push("/auth")}
					>
						Get started
					</Button>

					<Button
						component="a"
						href="https://github.com/n4ze3m/linkybase"
						size="xl"
						variant="default"
						className={classes.control}
						leftIcon={<IconBrandGithub size={20} />}
					>
						GitHub
					</Button>
				</Group>
			</Container>
			<Feature />
		</div>
	);
}
