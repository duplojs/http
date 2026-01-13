import { type ClientRequestParams } from "./types";

export function queryToString(query: ClientRequestParams["query"]) {
	return Object.entries(query)
		.reduce<string[]>(
			(pv, [key, value]) => {
				if (!value) {
					return pv;
				}

				if (Array.isArray(value)) {
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
		.join("&") || undefined;
}
