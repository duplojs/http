import { A } from "@duplojs/utils";
import type { HubPlugin } from "@core/hub";
import type { Parser } from "./parser";
import type { Serializer } from "./serialize";
import { cookieHooks } from "./hooks";
import { IgnoreRouteCookieMetadata } from "./metadata";

export interface CookiePluginParams {
	parser?: Parser;
	serializer?: Serializer;
}

export function cookiePlugin(params?: CookiePluginParams) {
	return (): HubPlugin => ({
		name: "cookie-plugin",
		hooksHubLifeCycle: [
			{
				beforeBuildRoute: (route) => {
					if (A.some(route.definition.metadata, IgnoreRouteCookieMetadata.is)) {
						return route;
					}
					return {
						...route,
						definition: {
							...route.definition,
							hooks: [...route.definition.hooks, cookieHooks(params)],
						},
					};
				},
			},
		],

	});
}
