import { type Steps } from "../../core/steps";
import { DP } from "@duplojs/utils";
import type { ResponseContract } from "../../core/response";
import type { EntrypointKey } from "./types";
export type EntrypointReduceResult = Record<EntrypointKey, DP.DataParser | Record<string, DP.DataParser>>;
export interface AggregateStepsResult {
    entrypointContract: EntrypointReduceResult;
    endpointContract: ResponseContract.Contracts[];
}
export interface AggregateStepsParams {
    readonly defaultExtractContract: ResponseContract.Contract;
}
export declare function aggregateStepContract(steps: readonly Steps[], params: AggregateStepsParams): AggregateStepsResult;
