import { type DP, type Kind, type O, type AnyFunction } from "@duplojs/utils";
import { type StepKind } from "./kind";
import { type Request } from "../request";
import { type ClientErrorResponseCode, type ResponseContract } from "../response";
import { type Metadata } from "../metadata";
export interface DisabledExtractKeysCustom {
}
export type DisabledExtractKeys = O.GetPropsWithValue<DisabledExtractKeysCustom, true>;
export type ExtractShape<GenericRequest extends Request = Request> = Partial<Record<Exclude<keyof GenericRequest, O.GetPropsWithValueExtends<GenericRequest, AnyFunction> | DisabledExtractKeys | "body" | "bodyReader" | "params" | symbol>, DP.DataParser | Record<string, DP.DataParser>> & {
    body: (DP.DataParser | Record<string, DP.DataParser>);
    params: Record<string, DP.DataParser>;
}>;
export interface ExtractStepDefinition {
    readonly shape: ExtractShape;
    readonly responseContract?: ResponseContract.Contract<ClientErrorResponseCode, string, DP.DataParserEmpty>;
    readonly metadata: readonly Metadata[];
}
export declare const extractStepKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/extract-step", unknown>>;
export type _ExtractStep = (Kind<typeof extractStepKind.definition> & StepKind);
export interface ExtractStep<GenericDefinition extends ExtractStepDefinition = ExtractStepDefinition> extends _ExtractStep {
    readonly definition: GenericDefinition;
}
export declare function createExtractStep<GenericDefinition extends ExtractStepDefinition>(definition: GenericDefinition): ExtractStep<GenericDefinition>;
