import { type Steps } from "../../core/steps";
import { DP } from "@duplojs/utils";
import { type EntrypointKey } from "./types";
import { ResponseContract } from "../../core/response";
type EntrypointReduceResult = Record<EntrypointKey, DP.DataParser | Record<string, DP.DataParser>>;
export interface StepsToDataParserParams {
    readonly defaultExtractContract: ResponseContract.Contract;
}
export interface StepsToDataParserResult {
    entrypointContract: EntrypointReduceResult;
    endpointContract: DP.DataParser[];
}
export declare function aggregateStepContract(steps: readonly Steps[], params: StepsToDataParserParams): StepsToDataParserResult;
export {};
