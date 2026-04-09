import { type Floor } from "@core/floor";
import { type ResponseContract } from "@core/response";
import { createRoute, type Route, type RouteDefinition } from "@core/route";
import { createHandlerStep, type HandlerStep, type HandlerStepFunctionParams } from "@core/steps";
import { type MaybePromise, type O, A } from "@duplojs/utils";
import { routeBuilderHandler } from "./builder";
import { routeStore } from "./store";
import { type Metadata, IgnoreByRouteStoreMetadata } from "@core/metadata";

declare module "./builder" {
	interface RouteBuilder<
		GenericDefinition extends RouteDefinition = RouteDefinition,
		GenericFloor extends Floor = {},
	> {
		handler<
			GenericResponseContract extends (
				| ResponseContract.Contracts
				| readonly [
					ResponseContract.Contracts,
					...ResponseContract.Contracts[],
				]
			),
			GenericResponse extends ResponseContract.Convert<
				GenericResponseContract extends readonly any[]
					? GenericResponseContract[number]
					: GenericResponseContract
			>,
			const GenericMetadata extends readonly Metadata[] = readonly [],
		>(
			responseContract: GenericResponseContract,
			theFunction: (
				floor: GenericFloor,
				params: HandlerStepFunctionParams<
					GenericResponse
				>
			) => MaybePromise<GenericResponse>,
			...metadata: GenericMetadata,
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
									params: HandlerStepFunctionParams<
										GenericResponse
									>
								): MaybePromise<GenericResponse>;
								readonly metadata: GenericMetadata;
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
		args: [
			responseContract,
			theFunction,
			...metadata
		],
		accumulator,
	}) => {
		const route = createRoute({
			...accumulator,
			steps: [
				...accumulator.steps,
				createHandlerStep({
					responseContract,
					theFunction,
					metadata,
				}),
			] as const,
		});

		const ignoreByRouteStoreMetadata = A.find(
			accumulator.metadata,
			IgnoreByRouteStoreMetadata.is,
		);

		if (
			ignoreByRouteStoreMetadata === undefined
		) {
			routeStore.add(route);
		}

		return route;
	},
);
