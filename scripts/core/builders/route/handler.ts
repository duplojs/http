import { type Floor } from "@core/floor";
import { type ResponseContract } from "@core/response";
import { createRoute, type Route, type RouteDefinition } from "@core/route";
import { createHandlerStep, type HandlerStep, type HandlerStepFunctionParams } from "@core/steps";
import { type MaybePromise, type AnyTuple, type O } from "@duplojs/utils";
import { routeBuilderHandler } from "./builder";
import { type Request } from "@core/request";
import { routeStore } from "./store";

declare module "./builder" {
	interface RouteBuilder<
		GenericDefinition extends RouteDefinition = RouteDefinition,
		GenericFloor extends Floor = {},
		GenericRequest extends Request = Request,
	> {
		handler<
			GenericResponseContract extends (
				| ResponseContract.Contract
				| readonly [ResponseContract.Contract, ...ResponseContract.Contract[]]
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
			) => MaybePromise<GenericResponse>
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
								): MaybePromise<GenericResponse>;
							}
						>,
					];
				}
			>
		>;
	}
}

routeBuilderHandler.set(
	"handler",
	({
		args: [responseContract, theFunction],
		accumulator,
	}) => {
		const route = createRoute({
			...accumulator,
			steps: [
				...accumulator.steps,
				createHandlerStep({
					responseContract,
					theFunction,
				}),
			] as const,
		});

		routeStore.add(route);

		return route;
	},
);
