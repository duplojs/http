import { type Floor } from "@core/floor";
import { type ResponseContract } from "@core/responseContract";
import { type RouteDefinition } from "@core/route";
import { type CutStepFunctionOutput, type CutStep, type CutStepFunctionParams, createCutStep } from "@core/steps";
import { type Unwrap, type AnyTuple, type O, type MaybePromise } from "@duplojs/utils";
import { routeBuilder } from "./builder";
import { type Request } from "@core/request";

declare module "./builder" {
	interface RouteBuilder<
		GenericDefinition extends RouteDefinition = RouteDefinition,
		GenericFloor extends Floor = {},
		GenericRequest extends Request = Request,
	> {
		cut<
			GenericResponseContract extends (
				| ResponseContract.Contract
				| [ResponseContract.Contract, ...ResponseContract.Contract[]]
			),
			GenericResponse extends ResponseContract.Convert<
				GenericResponseContract extends AnyTuple
					? GenericResponseContract[number]
					: GenericResponseContract
			>,
			GenericOutput extends CutStepFunctionOutput | GenericResponse,
		>(
			responseContract: GenericResponseContract,
			theFunction: (
				floor: GenericFloor,
				param: CutStepFunctionParams<
					GenericRequest,
					GenericResponse
				>
			) => MaybePromise<GenericOutput>
		): RouteBuilder<
			O.AssignObjects<
				GenericDefinition,
				{
					readonly steps: readonly [
						...GenericDefinition["steps"],
						CutStep<
							{
								responseContract: GenericResponseContract;
								theFunction(
									floor: GenericFloor,
									param: CutStepFunctionParams<
										GenericRequest,
										GenericResponse
									>
								): GenericResponse;
							}
						>,
					];
				}
			>,
			GenericOutput extends infer InferredOutputData extends CutStepFunctionOutput
				? O.AssignObjects<
					GenericFloor,
					Unwrap<InferredOutputData>
				>
				: never,
			GenericRequest
		>;
	}
}

routeBuilder.set(
	"cut",
	({
		args: [responseContract, theFunction],
		accumulator,
		next,
	}) => next({
		...accumulator,
		steps: [
			...accumulator.steps,
			createCutStep({
				responseContract,
				theFunction,
			}),
		],
	}),
);
