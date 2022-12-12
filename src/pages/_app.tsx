import {
	createBrowserSupabaseClient,
	type Session,
} from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

import { type AppType } from "next/app";

import { trpc } from "../utils/trpc";
import { Poppins } from "@next/font/google";

const poppins = Poppins({
	weight: "500",
});
import "../styles/globals.css";
import { MantineProvider } from "@mantine/core";
import React from "react";
import { NotificationsProvider } from "@mantine/notifications";
type Props = {
	initialSession: Session;
};
const MyApp: AppType<Props> = ({ Component, pageProps }) => {
	const [supabaseClient] = React.useState(() => createBrowserSupabaseClient());

	return (
		<MantineProvider
			withGlobalStyles={true}
			withNormalizeCSS={true}
			theme={{
				colorScheme: "dark",
				fontFamily: poppins.style.fontFamily,
			}}
		>
			<SessionContextProvider
				supabaseClient={supabaseClient}
				initialSession={pageProps.initialSession}
			>
				<NotificationsProvider>
					<Component {...pageProps} />{" "}
				</NotificationsProvider>
			</SessionContextProvider>
		</MantineProvider>
	);
};

export default trpc.withTRPC(MyApp);
