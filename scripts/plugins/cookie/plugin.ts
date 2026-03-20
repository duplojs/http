import type { HubPlugin } from "@core/hub";
import { defaultParser, type Parser } from "./parser";
import { defaultSerializer, type Serializer } from "./serialize";
import { parseRequestCookieHook, serializeResponseCookieHook } from "./hooks";

export interface CookiePluginParams {
	parser?: Parser;
	serializer?: Serializer;
}

export function cookiePlugin(params?: CookiePluginParams) {
	return (): HubPlugin => ({
		name: "cookie-plugin",
		hooksRouteLifeCycle: [
			parseRequestCookieHook({ parser: params?.parser ?? defaultParser }),
			serializeResponseCookieHook({ serializer: params?.serializer ?? defaultSerializer }),
		],
	});
}
