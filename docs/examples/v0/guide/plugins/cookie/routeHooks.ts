import { useRouteBuilder } from "@duplojs/http";
import { defaultParser, defaultSerializer, parseRequestCookieHook, serializeResponseCookieHook } from "@duplojs/http/cookie";

const route = useRouteBuilder("GET", "/admin/session", {
	hooks: [
		parseRequestCookieHook({
			parser: defaultParser, // or custom parser
		}),
		serializeResponseCookieHook({
			serializer: defaultSerializer, // or custom serializer
		}),
	],
}); // ...
