import { type Floor } from "../../floor";
import { type ResponseContract } from "../../response";
import { type RouteDefinition } from "../../route";
import { type CutStepFunctionOutput, type CutStep, type CutStepFunctionParams } from "../../steps";
import { type Unwrap, type O, type MaybePromise, type IsEqual, type A } from "@duplojs/utils";
import { type Request } from "../../request";
import { type Metadata } from "../../metadata";
declare module "./builder" {
    interface RouteBuilder<GenericDefinition extends RouteDefinition = RouteDefinition, GenericFloor extends Floor = {}, GenericRequest extends Request = Request> {
        cut<const GenericResponseContract extends (ResponseContract.Contract | readonly ResponseContract.Contract[]), GenericResponse extends ResponseContract.Convert<A.ArrayCoalescing<GenericResponseContract>[number]>, GenericOutput extends CutStepFunctionOutput | GenericResponse, const GenericMetadata extends readonly Metadata[] = readonly []>(responseContract: GenericResponseContract, theFunction: (floor: GenericFloor, params: CutStepFunctionParams<GenericRequest, GenericResponse>) => MaybePromise<GenericOutput>, ...metadata: GenericMetadata): RouteBuilder<O.AssignObjects<GenericDefinition, {
            readonly steps: readonly [
                ...GenericDefinition["steps"],
                CutStep<{
                    readonly responseContract: GenericResponseContract;
                    theFunction(floor: GenericFloor, param: CutStepFunctionParams<GenericRequest, GenericResponse>): MaybePromise<GenericOutput>;
                    readonly metadata: GenericMetadata;
                }>
            ];
        }>, IsEqual<Extract<GenericOutput, CutStepFunctionOutput>, never> extends true ? GenericFloor : (GenericOutput extends infer InferredOutputData extends CutStepFunctionOutput ? O.AssignObjects<GenericFloor, Unwrap<InferredOutputData>> : never), GenericRequest>;
    }
}
