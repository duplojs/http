import { type Hub } from "../hub";
import { type BuildedRouter } from "./types";
export * from "./types";
export * from "./pathToRegExp";
export * from "./buildError";
export * from "./decodeUrl";
export declare function buildRouter(inputHub: Hub): Promise<BuildedRouter>;
