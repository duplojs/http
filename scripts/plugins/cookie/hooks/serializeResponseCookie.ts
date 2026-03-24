import { createHookRouteLifeCycle } from "@core/route";
import { type Serializer } from "../serialize";

export interface SerializeResponseCookieHookParams {
	serializer: Serializer;
}

export function serializeResponseCookieHook(params: SerializeResponseCookieHookParams) {
	return createHookRouteLifeCycle({
		beforeSendResponse: ({ currentResponse, next }) => {
			if (currentResponse.cookie !== undefined && Object.keys(currentResponse.cookie).length !== 0) {
				currentResponse.setHeader(
					"set-cookie",
					Object.entries(currentResponse.cookie).map(
						([name, content]) => params.serializer(name, content.value, content.params),
					),
				);
			}

			return next();
		},
	});
}
