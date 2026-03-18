import { type Hub } from "../hub";
import { type BuildedRouter } from "./types";
export * from "./types";
export * from "./pathToRegExp";
export * from "./buildError";
export * from "./decodeUrl";
export * from "./notFoundBodyReaderImplementationError";
export * from "./buildSystemRoute";
export declare function buildRouter(hub: Hub): Promise<BuildedRouter>;
