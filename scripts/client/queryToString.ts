import { type ClientRequestParams } from "./types";

export function queryToString(query: ClientRequestParams["query"]) {
	if (!query) {
		return null;
	}

	return Object.entries(query)
		.reduce<string[]>(
			(pv, [key, value]) => {
				if (!value) {
					return pv;
				}

				if (value instanceof Array) {
					value.forEach((subValue) => {
						pv.push(`${key}=${subValue}`);
					});
				} else {
					pv.push(`${key}=${value}`);
				}

				return pv;
			},
			[],
		)
		.join("&") || null;
}
