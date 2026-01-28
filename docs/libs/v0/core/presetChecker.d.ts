import { type O, type Kind, type MaybeArray, type AnyFunction } from "@duplojs/utils";
import { type GetCheckerInput, type Checker, type GetCheckerOptions, type GetCheckerResult } from "./checker";
import { type ClientErrorResponseCode, type ResponseContract } from "./response";
export interface PresetCheckerDefinition {
    readonly checker: Checker;
    readonly result: string | readonly string[];
    readonly indexing?: string;
    rewriteInput?(input: unknown): unknown;
    readonly options?: Record<string, unknown>;
    readonly responseContract: ResponseContract.Contract<ClientErrorResponseCode>;
}
export declare const presetCheckerKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/preset-checker", unknown>>;
export interface PresetChecker<GenericDefinition extends PresetCheckerDefinition = PresetCheckerDefinition> extends Kind<typeof presetCheckerKind.definition> {
    readonly definition: GenericDefinition;
    indexing<GenericIndex extends string>(indexing: GenericIndex): PresetChecker<O.AssignObjects<GenericDefinition, {
        readonly indexing: GenericIndex;
    }>>;
    rewriteInput<GenericInput extends unknown>(rewriteInput: (input: GenericInput) => GetCheckerInput<GenericDefinition["checker"]>): PresetChecker<O.AssignObjects<GenericDefinition, {
        rewriteInput(input: GenericInput): GetCheckerInput<GenericDefinition["checker"]>;
    }>>;
    options<const GenericOptions extends GetCheckerOptions<GenericDefinition["checker"]>>(options: GenericOptions): PresetChecker<O.AssignObjects<GenericDefinition, {
        readonly options: GenericOptions;
    }>>;
}
export declare function createPresetChecker<GenericChecker extends Checker, const GenericDefinition extends {
    result: MaybeArray<Awaited<GetCheckerResult<GenericChecker>>["information"]>;
    indexing?: string;
    rewriteInput?(input: unknown): GetCheckerInput<GenericChecker>;
    options?: GetCheckerOptions<GenericChecker>;
    otherwise: ResponseContract.Contract<ClientErrorResponseCode>;
}>(checker: GenericChecker, { otherwise, ...definition }: GenericDefinition): PresetChecker<O.AssignObjects<Omit<GenericDefinition, "otherwise">, {
    readonly checker: GenericChecker;
    readonly responseContract: GenericDefinition["otherwise"];
}>>;
export type GetPresetCheckerInput<GenericPresetChecker extends PresetChecker> = GenericPresetChecker["definition"]["rewriteInput"] extends AnyFunction ? Parameters<GenericPresetChecker["definition"]["rewriteInput"]>[0] : Parameters<GenericPresetChecker["definition"]["checker"]["definition"]["theFunction"]>[0];
export type GetPresetCheckerResult<GenericPresetChecker extends PresetChecker> = ReturnType<GenericPresetChecker["definition"]["checker"]["definition"]["theFunction"]>;
export type GetPresetCheckerIndex<GenericPresetChecker extends PresetChecker> = GenericPresetChecker["definition"]["indexing"] extends string ? GenericPresetChecker["definition"]["indexing"] : never;
export type GetPresetCheckerInformation<GenericPresetChecker extends PresetChecker> = GenericPresetChecker["definition"]["result"];
