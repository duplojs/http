import { type Kind } from "@duplojs/utils";
import { type StepKind } from "./kind";
import { type Checker } from "../checker";
import { type Floor } from "../floor";
import { type ClientErrorResponseCode, type ResponseContract } from "../response";
import { type Metadata } from "../metadata";
export interface CheckerStepDefinition {
    readonly checker: Checker;
    readonly result: string | readonly string[];
    readonly indexing?: string;
    input(input: Floor): unknown;
    readonly options?: Record<string, unknown> | ((input: any) => Record<string, unknown>);
    readonly responseContract: ResponseContract.Contract<ClientErrorResponseCode>;
    readonly metadata: readonly Metadata[];
}
export declare const checkerStepKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/checker-step", unknown>>;
export type _CheckerStep = (Kind<typeof checkerStepKind.definition> & StepKind);
export interface CheckerStep<GenericDefinition extends CheckerStepDefinition = CheckerStepDefinition> extends _CheckerStep {
    readonly definition: GenericDefinition;
}
export declare function createCheckerStep<GenericDefinition extends CheckerStepDefinition>(definition: GenericDefinition): CheckerStep<GenericDefinition>;
