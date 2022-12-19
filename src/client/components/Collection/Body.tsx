import {
	ActionIcon,
	Container,
	createStyles,
	Group,
	Text,
	Title,
	UnstyledButton,
} from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";
import { trpc } from "src/utils/trpc";
import { Loading, LoadingBreadcrumb } from "../Common/Loading";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { MoveModal } from "../Common/MoveModal";
import { useInView } from "react-intersection-observer";
import { PreviewCard } from "../Common/PreviewCard";
import { IconEdit, IconSettings, IconSettings2 } from "@tabler/icons";
import { SettingsModal } from "./Settings";
import { Empy } from "../Common/Empy";
const useStyles = createStyles((theme) => ({
	linkContainer: {
		marginTop: theme.spacing.md,
		marginBottom: theme.spacing.md,
	},
	linkBody: {
		paddingLeft: theme.spacing.md,
		width: "80%",
	},
	title: {
		fontWeight: 600,
		lineHeight: 1.2,
	},
}));

export const CollectionBody: React.FC = () => {
	const router = useRouter();
	const { ref: inRef, inView } = useInView();

	const [openSettingsModal, setOpenSettingsModal] = React.useState(false);

	const { classes } = useStyles();

	const {
		data: collection,
		status,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = trpc.collection.getById.useInfiniteQuery(
		{
			id: router.query.id as string,
			limit: 10,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
			refetchInterval: 2000,
		},
	);
	React.useEffect(() => {
		fetchNextPage();
	}, [inView]);

	const [openMoveModal, setOpenMoveModal] = React.useState(false);
	const [linkId, setLinkId] = React.useState("");

	return (
		<Container my="md">
			{status === "loading" ? (
				<LoadingBreadcrumb />
			) : (
				<>
					<Group position="apart">
						<Group>
							{status === "success" &&
							collection?.pages.length > 0 &&
							collection?.pages[0]?.collection.emoji ? (
								<Emoji
									unified={collection?.pages[0]?.collection.emoji}
									size={32}
									emojiStyle={EmojiStyle.APPLE}
								/>
							) : null}
							<Title weight="bold" color="dimmed">
								{status === "success" && collection?.pages.length > 0
									? collection?.pages[0]?.collection.name
									: "Untitled"}
							</Title>
						</Group>
						<Group position="right">
							<ActionIcon
								color="gray"
								onClick={() => setOpenSettingsModal(true)}
							>
								<IconSettings2 stroke={1.5} />
							</ActionIcon>
						</Group>
					</Group>
					{status === "success" && collection?.pages.length > 0 && (
						<Text color="dimmed" size="sm">
							{collection?.pages[0]?.collection.description}
						</Text>
					)}
				</>
			)}
			<div className={classes.linkContainer}>
				{status === "loading" ? <Loading /> : null}
				{status === "error" ? <Text>Error</Text> : null}
				{status === "success" ? (
					<div>
						{collection?.pages.map((page) => (
							<div key={page.nextCursor}>
								{page.links.map((link) => (
									<PreviewCard
										key={link.id}
										{...link}
										onMove={() => {
											setLinkId(link.id);
											setOpenMoveModal(true);
										}}
									/>
								))}
							</div>
						))}
						<div ref={inRef}>
							{hasNextPage && isFetchingNextPage && "Loading more..."}
						</div>

						{collection.pages[0]?.links.length === 0 ? <Empy /> : null}
					</div>
				) : null}
				<MoveModal
					open={openMoveModal}
					onClose={() => setOpenMoveModal(false)}
					linkId={linkId}
				/>
				{openSettingsModal && (
					<SettingsModal
						{...collection?.pages[0]?.collection!}
						open={openSettingsModal}
						onClose={() => setOpenSettingsModal(false)}
					/>
				)}
			</div>
		</Container>
	);
};
