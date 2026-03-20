import { createHub, ResponseContract, useRouteBuilder } from "@duplojs/http";
import {
	defaultParser,
	defaultSerializer,
	parseRequestCookieHook,
	serializeResponseCookieHook,
} from "@duplojs/http/cookie";
import { DPE } from "@duplojs/utils";

const route = useRouteBuilder("GET", "/admin/session", {
	hooks: [
		parseRequestCookieHook({
			parser: defaultParser, // or custom parser
		}),
		serializeResponseCookieHook({
			serializer: defaultSerializer, // or custom serializer
		}),
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
