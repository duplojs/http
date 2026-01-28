import { type CheckerDefinition, type Checker, type CheckerFunctionOutput, type CheckerFunctionParams } from "../checker";
import { type Builder, type MaybePromise, type NeverCoalescing } from "@duplojs/utils";
export interface CheckerBuilderParams {
    readonly options?: Record<string, unknown>;
}
export interface CheckerBuilder<GenericParams extends CheckerBuilderParams = CheckerBuilderParams> extends Builder<CheckerBuilderParams> {
    handler<GenericInput extends unknown, GenericOutput extends CheckerFunctionOutput>(theFunction: (input: GenericInput, params: CheckerFunctionParams<GenericParams["options"]>) => MaybePromise<GenericOutput>): Checker<{
        theFunction(input: GenericInput, params: CheckerFunctionParams<GenericParams["options"]>): MaybePromise<GenericOutput>;
        options: GenericParams["options"];
    }>;
}
export declare const checkerBuilder: import("@duplojs/utils").BuilderHandler<CheckerBuilder<CheckerBuilderParams>>;
export declare function useCheckerBuilder<GenericOptions extends CheckerDefinition["options"] = never>(params?: {
    options?: GenericOptions;
}): CheckerBuilder<{
    readonly options: NeverCoalescing<GenericOptions, undefined>;
}>;
