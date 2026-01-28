import { type Floor } from "../../floor";
import { type ResponseContract } from "../../response";
import { type Route, type RouteDefinition } from "../../route";
import { type HandlerStep, type HandlerStepFunctionParams } from "../../steps";
import { type MaybePromise, type AnyTuple, type O } from "@duplojs/utils";
import { type Request } from "../../request";
import { type Metadata } from "../../metadata";
declare module "./builder" {
    interface RouteBuilder<GenericDefinition extends RouteDefinition = RouteDefinition, GenericFloor extends Floor = {}, GenericRequest extends Request = Request> {
        handler<GenericResponseContract extends (ResponseContract.Contract | readonly [ResponseContract.Contract, ...ResponseContract.Contract[]]), GenericResponse extends ResponseContract.Convert<GenericResponseContract extends AnyTuple ? GenericResponseContract[number] : GenericResponseContract>, const GenericMetadata extends readonly Metadata[] = readonly []>(responseContract: GenericResponseContract, theFunction: (floor: GenericFloor, param: HandlerStepFunctionParams<GenericRequest, GenericResponse>) => MaybePromise<GenericResponse>, ...metadata: GenericMetadata): Route<O.AssignObjects<GenericDefinition, {
            readonly steps: readonly [
                ...GenericDefinition["steps"],
                HandlerStep<{
                    readonly responseContract: GenericResponseContract;
                    theFunction(floor: GenericFloor, param: HandlerStepFunctionParams<GenericRequest, GenericResponse>): MaybePromise<GenericResponse>;
                    readonly metadata: GenericMetadata;
                }>
            ];
        }>>;
    }
}
