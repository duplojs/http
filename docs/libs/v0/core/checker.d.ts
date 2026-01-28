import { type MaybePromise, type Kind } from "@duplojs/utils";
export declare const checkerOutputKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/checker-output", unknown>>;
export interface CheckerFunctionOutput<GenericInformation extends string = string, GenericValue extends unknown = unknown> extends Kind<typeof checkerOutputKind.definition> {
    information: GenericInformation;
    value: GenericValue;
}
export interface CheckerFunctionParams<GenericOptions extends Record<string, unknown> | undefined = Record<string, unknown> | undefined> {
    options: GenericOptions;
    output<GenericInformation extends string, GenericValue extends unknown>(information: GenericInformation, value: GenericValue): CheckerFunctionOutput<GenericInformation, GenericValue>;
}
export interface CheckerDefinition {
    theFunction(input: unknown, params: CheckerFunctionParams): MaybePromise<CheckerFunctionOutput>;
    readonly options?: Record<string, unknown>;
}
export declare const checkerKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/checker", unknown>>;
export interface Checker<GenericDefinition extends CheckerDefinition = CheckerDefinition> extends Kind<typeof checkerKind.definition> {
    readonly definition: GenericDefinition;
}
export declare function createChecker<GenericDefinition extends CheckerDefinition>(definition: GenericDefinition): Checker<GenericDefinition>;
export type GetCheckerInput<GenericChecker extends Checker> = Parameters<GenericChecker["definition"]["theFunction"]>[0];
export type GetCheckerResult<GenericChecker extends Checker> = ReturnType<GenericChecker["definition"]["theFunction"]>;
export type GetCheckerOptions<GenericChecker extends Checker> = GenericChecker["definition"]["options"];
