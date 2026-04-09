import { type Floor } from "../../floor";
import { type ResponseContract } from "../../response";
import { type Route, type RouteDefinition } from "../../route";
import { type HandlerStep, type HandlerStepFunctionParams } from "../../steps";
import { type MaybePromise, type O } from "@duplojs/utils";
import { type Metadata } from "../../metadata";
declare module "./builder" {
    interface RouteBuilder<GenericDefinition extends RouteDefinition = RouteDefinition, GenericFloor extends Floor = {}> {
        handler<GenericResponseContract extends (ResponseContract.Contracts | readonly [
            ResponseContract.Contracts,
            ...ResponseContract.Contracts[]
        ]), GenericResponse extends ResponseContract.Convert<GenericResponseContract extends readonly any[] ? GenericResponseContract[number] : GenericResponseContract>, const GenericMetadata extends readonly Metadata[] = readonly []>(responseContract: GenericResponseContract, theFunction: (floor: GenericFloor, params: HandlerStepFunctionParams<GenericResponse>) => MaybePromise<GenericResponse>, ...metadata: GenericMetadata): Route<O.AssignObjects<GenericDefinition, {
            readonly steps: readonly [
                ...GenericDefinition["steps"],
                HandlerStep<{
                    readonly responseContract: GenericResponseContract;
                    theFunction(floor: GenericFloor, params: HandlerStepFunctionParams<GenericResponse>): MaybePromise<GenericResponse>;
                    readonly metadata: GenericMetadata;
                }>
            ];
        }>>;
    }
}
