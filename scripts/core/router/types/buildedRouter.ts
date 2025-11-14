import { type RequestInitializationData } from "@core/request";

export type BuildedRouter = (
	initializationData: Pick<
		RequestInitializationData,
		| "headers"
		| "host"
		| "method"
		| "origin"
		| "path"
		| "query"
		| "url"
	>
) => Promise<void>;

