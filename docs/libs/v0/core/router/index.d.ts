import { type Hub } from "../hub";
import { type Router } from "./types";
export * from "./types";
export * from "./pathToRegExp";
export * from "./buildError";
export * from "./notFoundBodyReaderImplementationError";
export * from "./createRouterElementSystem";
export declare function createRouter(hub: Hub): Promise<Router>;
