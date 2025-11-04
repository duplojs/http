import { type Floor } from "@core/floor";
import { type ResponseContract } from "@core/response";
import { createRoute, type Route, type RouteDefinition } from "@core/route";
import { createHandlerStep, type HandlerStep, type HandlerStepFunctionParams } from "@core/steps";
import { type AnyTuple, type O } from "@duplojs/utils";
import { routeBuilder } from "./builder";
import { type Request } from "@core/request";

declare module "./builder" {
	interface RouteBuilder<
		GenericDefinition extends RouteDefinition = RouteDefinition,
		GenericFloor extends Floor = {},
		GenericRequest extends Request = Request,
	> {
		handler<
			GenericResponseContract extends (
				| ResponseContract.Contract
				| [ResponseContract.Contract, ...ResponseContract.Contract[]]
			),
			GenericResponse extends ResponseContract.Convert<
				GenericResponseContract extends AnyTuple
					? GenericResponseContract[number]
					: GenericResponseContract
			>,
		>(
			responseContract: GenericResponseContract,
			theFunction: (
				floor: GenericFloor,
				param: HandlerStepFunctionParams<
					GenericRequest,
					GenericResponse
				>
			) => GenericResponse
		): Route<
			O.AssignObjects<
				GenericDefinition,
				{
					readonly steps: readonly [
						...GenericDefinition["steps"],
						HandlerStep<
							{
								readonly responseContract: GenericResponseContract;
								theFunction(
									floor: GenericFloor,
									param: HandlerStepFunctionParams<
										GenericRequest,
										GenericResponse
									>
								): GenericResponse;
							}
						>,
					];
				}
			>
		>;
	}
}

routeBuilder.set(
	"handler",
	({
		args: [responseContract, theFunction],
		accumulator,
	}) => createRoute({
		...accumulator,
		steps: [
			...accumulator.steps,
			createHandlerStep({
				responseContract,
				theFunction,
			}),
		],
	}),
);
