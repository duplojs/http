import { createHub, ResponseContract, useRouteBuilder } from "@duplojs/http";
import { cookieHooks } from "@duplojs/http/cookie";
import { DPE } from "@duplojs/utils";

const route = useRouteBuilder("GET", "/admin/session", {
	hooks: [
		// defaultParser and defaultSerializer are use if nothing is given
		cookieHooks(),
	],
})
	.extract({
		cookies: {
			session: DPE.string(),
		},
	})
	.handler(
		ResponseContract.ok(
			"admin.session.read",
			DPE.object({
				session: DPE.string(),
			}),
		),
		({ session }, { response }) => response(
			"admin.session.read",
			{
				session,
			},
		).setCookie("admin-session", session, {
			httpOnly: true,
			path: "/admin",
		}),
	);

const hub = createHub({ environment: "DEV" })
	.register(route);
