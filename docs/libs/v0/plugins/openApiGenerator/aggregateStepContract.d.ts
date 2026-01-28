import { type Steps } from "../../core/steps";
import { DP } from "@duplojs/utils";
import type { ResponseCode, ResponseContract } from "../../core/response";
import type { EntrypointKey } from "./types";
export interface EndpointRouteResult {
    code: ResponseCode;
    information: string;
    body: DP.DataParser;
}
export type EntrypointReduceResult = Record<EntrypointKey, DP.DataParser | Record<string, DP.DataParser>>;
export interface AggregateStepsResult {
    entrypointContract: EntrypointReduceResult;
    endpointContract: EndpointRouteResult[];
}
export interface AggregateStepsParams {
    readonly defaultExtractContract: ResponseContract.Contract;
}
export declare function aggregateStepContract(steps: readonly Steps[], params: AggregateStepsParams): AggregateStepsResult;
