import { type RequestInitializationData } from "../../request";
export type RouterParams = Omit<RequestInitializationData, "matchedPath" | "bodyReader" | "params" | "path" | "query">;
export type BuildedRouter = (params: RouterParams) => Promise<void>;
