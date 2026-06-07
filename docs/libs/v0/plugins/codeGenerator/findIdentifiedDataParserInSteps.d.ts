import { type Steps } from "../../core/steps";
import { DP } from "@duplojs/utils";
export type IdentifiedDataParser = (DP.DataParser & {
    definition: {
        identifier: string;
    };
});
export declare function dataParserHasIdentifier(dataParser: DP.DataParser): dataParser is IdentifiedDataParser;
export interface findIdentifiedDataParserInStepsParams {
    readonly ignoreDataParser: Set<DP.DataParser>;
}
export declare function findIdentifiedDataParserInSteps(steps: readonly Steps[], params: findIdentifiedDataParserInStepsParams): IdentifiedDataParser[];
