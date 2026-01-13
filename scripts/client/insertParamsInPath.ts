import { type ClientRequestParams } from "./types";

export function insertParamsInPath(path: string, params: ClientRequestParams["params"] = {}) {
	return Object.entries(params).reduce(
		(pv, [key, value]) => pv.replace(`{${key}}`, value.toString()),
		path,
	);
}
