import { ResponseContract, useRouteBuilder } from "@duplojs/http";
import { DPE } from "@duplojs/utils";

useRouteBuilder("GET", "/cookie-check")
	.extract({
		cookies: {
			session: DPE.string(),
		},
	})
	.handler(
		ResponseContract.ok(
			"cookie.checked",
			DPE.object({
				session: DPE.string(),
			}),
		),
		({ session }, { response }) => response(
			"cookie.checked",
			{
				session,
			},
		).setCookie("refresh", "next-token", {
			httpOnly: true,
			path: "/",
			sameSite: "lax",
		}),
	);

useRouteBuilder("GET", "/cookie-drop")
	.handler(
		ResponseContract.noContent("cookie.dropped"),
		(__, { response }) => response("cookie.dropped").dropCookie("session"),
	);
