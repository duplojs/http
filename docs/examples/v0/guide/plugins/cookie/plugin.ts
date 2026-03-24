import { createHub, ResponseContract, useRouteBuilder } from "@duplojs/http";
import { cookiePlugin } from "@duplojs/http/cookie";
import { DPE } from "@duplojs/utils";

const route = useRouteBuilder("GET", "/profile")
	.extract({
		cookies: {
			session: DPE.string(),
		},
	})
	.handler(
		ResponseContract.noContent("profile.read"),
		(floor, { response }) => response("profile.read")
			.setCookie("last-route", "profile", {
				httpOnly: true,
				path: "/",
				sameSite: "lax",
			}),
	);

const hub = createHub({ environment: "DEV" })
	.plug(
		cookiePlugin(),
	)
	.register(route);
