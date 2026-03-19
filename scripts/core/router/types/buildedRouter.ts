import { type RequestInitializationData } from "@core/request";

// need omit to correct override
export type RouterParams = Omit<
	RequestInitializationData,
	| "matchedPath"
	| "bodyReader"
	| "params"
	| "path"
	| "query"
>;

export type BuildedRouter = (
	params: RouterParams
) => Promise<void>;
