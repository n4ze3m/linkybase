import { ActionIcon, Container, createStyles, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconSearch } from "@tabler/icons";
import React from "react";
import { trpc } from "src/utils/trpc";
import { Loading } from "../Common/Loading";
import { PreviewCard } from "../Common/PreviewCard";

const useStyles = createStyles((theme) => ({
	searchContainer: {
		marginTop: theme.spacing.md,
	},
}));

export const SearchBody = () => {
	const { classes } = useStyles();

	const form = useForm({
		initialValues: {
			query: "",
		},
	});

	const {
		mutate: search,
		data: searchResults,
		status: searchStatus,
	} = trpc.link.search.useMutation();

	return (
		<Container>
			<form onSubmit={form.onSubmit((values) => search(values))}>
				<TextInput
					required
					placeholder="Search for a link"
					{...form.getInputProps("query")}
					rightSection={
						<ActionIcon type="submit">
							<IconSearch />
						</ActionIcon>
					}
				/>
			</form>

			<div className={classes.searchContainer}>
				{searchStatus === "loading" && <Loading />}
				{searchResults?.map((link) => (
					<PreviewCard
						key={link.id}
						{...link}
						onMove={() => {}}
						hideActions={true}
					/>
				))}
			</div>
		</Container>
	);
};
