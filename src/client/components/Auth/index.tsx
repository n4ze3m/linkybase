import {
	TextInput,
	Paper,
	Title,
	Text,
	Container,
	Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useMutation } from "@tanstack/react-query";

export function AuthBody() {
	const form = useForm({
		initialValues: {
			email: "",
		},
	});
	const { supabaseClient } = useSessionContext();

	const handleSubmit = async (email: string) => {
		const { data, error } = await supabaseClient.auth.signInWithOtp({
			email,
		});

		if (error) {
			throw new Error(error.message);
		}

		if (data) {
			return data;
		}

		return null;
	};

	const { isLoading, mutateAsync: sendMagicLink } = useMutation(handleSubmit, {
		onError: () => {
			showNotification({
				title: "Error",
				color: "red",
				message: "Something went wrong",
			});
		},
		onSuccess: () => {
			showNotification({
				title: "Success",
				color: "green",
				message: "Check your email for a magic link",
			});
		},
	});

	return (
		<Container size={420} my={20}>
			<Title align="center" sx={() => ({ fontWeight: 900 })}>
				Ready to get started?
			</Title>
			<Text color="dimmed" size="sm" align="center" mt={5}>
				{"Start organizing your links and sharing them with the world"}
			</Text>

			<Paper withBorder shadow="md" p={30} mt={30} radius="md">
				<form onSubmit={form.onSubmit((values) => sendMagicLink(values.email))}>
					<TextInput
						label="Email"
						placeholder="you@example.com"
						required
						{...form.getInputProps("email")}
					/>
					<Button
						loading={isLoading}
						fullWidth
						mt="xl"
						type="submit"
						color="teal"
					>
						Send me a magic link
					</Button>
				</form>
			</Paper>
		</Container>
	);
}
