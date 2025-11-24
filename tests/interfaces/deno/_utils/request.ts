import { type RequestInitializationData, Request } from "@core";
import { type SimplifyTopLevel } from "@duplojs/utils";

type InitializationData = SimplifyTopLevel<
	& Omit<Partial<RequestInitializationData>, "raw">
	& { body?: unknown }
	& { raw?: unknown }
>;

export function createFakeRequest({ raw, ...initializationData }: InitializationData = {}) {
	return new Request({
		method: "GET",
		path: "/",
		headers: {},
		query: {},
		params: {},
		host: "",
		matchedPath: "/",
		origin: "",
		url: "",
		raw: {} as any,
		...initializationData,
	});
}
