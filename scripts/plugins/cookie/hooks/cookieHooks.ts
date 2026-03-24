import { type Parser, defaultParser } from "../parser";
import { type Serializer, defaultSerializer } from "../serialize";
import { parseRequestCookieHook } from "./parseRequestCookie";
import { serializeResponseCookieHook } from "./serializeResponseCookie";

interface CookieHooksParams {
	parser?: Parser;
	serializer?: Serializer;
}

export function cookieHooks(
	{
		parser = defaultParser,
		serializer = defaultSerializer,
	}: CookieHooksParams = {},
) {
	return {
		...parseRequestCookieHook({ parser }),
		...serializeResponseCookieHook({ serializer }),
	};
}
