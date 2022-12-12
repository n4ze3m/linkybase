import { useUser } from "@supabase/auth-helpers-react";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { AuthBody } from "src/client/components/Auth";

import { LandingLayout } from "src/client/layouts/landing";

const Auth: NextPage = () => {
    
	const user = useUser();
	const router = useRouter();

	if (user) {
		router.push("/dashboard");
	}

	return (
		<LandingLayout>
			<Head>
				<title>
					Get started / LinkYBase / Collect, organize, and share your links
				</title>
			</Head>
			<AuthBody />
		</LandingLayout>
	);
};

export default Auth;
