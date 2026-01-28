import { type Floor } from "../../floor";
import { type CheckerStep } from "../../steps";
import { type O, type MaybeArray, type NeverCoalescing, type FixDeepFunctionInfer, type Adaptor, type AnyFunction, type DP, type A } from "@duplojs/utils";
import { type GetCheckerResult, type Checker, type GetCheckerInput, type GetCheckerOptions } from "../../checker";
import { type ClientErrorResponseCode, type ResponseContract } from "../../response";
import { type ProcessDefinition } from "../../process";
import { type Request } from "../../request";
import { type Metadata } from "../../metadata";
declare module "./builder" {
    interface ProcessBuilder<GenericDefinition extends ProcessDefinition = ProcessDefinition, GenericFloor extends Floor = {}, GenericRequest extends Request = Request> {
        check<GenericChecker extends Checker, GenericResultInformation extends MaybeArray<Awaited<GetCheckerResult<GenericChecker>>["information"]>, GenericInput extends GetCheckerInput<GenericChecker>, GenericResponseContract extends ResponseContract.Contract<ClientErrorResponseCode, string, DP.DataParserEmpty>, GenericIndex extends string = never, GenericOptions extends (GetCheckerOptions<GenericChecker> | ((floor: GenericFloor) => Exclude<GetCheckerOptions<GenericChecker>, undefined>)) = never, const GenericMetadata extends readonly Metadata[] = readonly []>(checker: GenericChecker, params: {
            input(floor: GenericFloor): GenericInput;
            readonly result: GenericResultInformation;
            readonly indexing?: GenericIndex;
            readonly options?: FixDeepFunctionInfer<GenericChecker["definition"]["options"] | ((floor: GenericFloor) => GenericChecker["definition"]["options"]), GenericOptions>;
            readonly otherwise: GenericResponseContract;
        }, ...metadata: GenericMetadata): ProcessBuilder<O.AssignObjects<GenericDefinition, {
            readonly steps: readonly [
                ...GenericDefinition["steps"],
                CheckerStep<{
                    readonly checker: GenericChecker;
                    readonly result: GenericResultInformation;
                    readonly indexing: NeverCoalescing<GenericIndex, undefined>;
                    input(floor: GenericFloor): GenericInput;
                    readonly options: NeverCoalescing<Adaptor<GenericOptions, AnyFunction | GenericChecker["definition"]["options"]>, undefined>;
                    readonly responseContract: GenericResponseContract;
                    readonly metadata: GenericMetadata;
                }>
            ];
        }>, O.AssignObjects<GenericFloor, {
            [Prop in GenericIndex]: Extract<Awaited<GetCheckerResult<GenericChecker>>, {
                information: A.ArrayCoalescing<GenericResultInformation>[number];
            }>["value"];
        }>, GenericRequest>;
    }
}
