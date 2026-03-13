import { type Floor } from "../../floor";
import { type ResponseContract } from "../../response";
import { type Route, type RouteDefinition } from "../../route";
import { type HandlerStep, type HandlerStepFunctionParams } from "../../steps";
import { type MaybePromise, type O } from "@duplojs/utils";
import { type Request } from "../../request";
import { type Metadata } from "../../metadata";
declare module "./builder" {
    interface RouteBuilder<GenericDefinition extends RouteDefinition = RouteDefinition, GenericFloor extends Floor = {}, GenericRequest extends Request = Request> {
        handler<GenericResponseContract extends (ResponseContract.Contract | ResponseContract.ServerSentEventsContract | readonly [
            (ResponseContract.Contract | ResponseContract.ServerSentEventsContract),
            ...(ResponseContract.Contract | ResponseContract.ServerSentEventsContract)[]
        ]), GenericResponse extends ResponseContract.Convert<GenericResponseContract extends readonly any[] ? GenericResponseContract[number] : GenericResponseContract>, const GenericMetadata extends readonly Metadata[] = readonly []>(responseContract: GenericResponseContract, theFunction: (floor: GenericFloor, param: HandlerStepFunctionParams<GenericRequest, GenericResponse>) => MaybePromise<GenericResponse>, ...metadata: GenericMetadata): Route<O.AssignObjects<GenericDefinition, {
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
