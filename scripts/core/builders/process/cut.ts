import { type Floor } from "@core/floor";
import { type ResponseContract } from "@core/response";
import { type CutStepFunctionOutput, type CutStep, type CutStepFunctionParams, createCutStep } from "@core/steps";
import { type Unwrap, type AnyTuple, type O, type MaybePromise, type IsEqual } from "@duplojs/utils";
import { processBuilder } from "./builder";
import { type ProcessDefinition } from "@core/process";
import { type Request } from "@core/request";

declare module "./builder" {
	interface ProcessBuilder<
		GenericDefinition extends ProcessDefinition = ProcessDefinition,
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
		): ProcessBuilder<
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
								): MaybePromise<GenericOutput>;
							}
						>,
					];
				}
			>,
			IsEqual<
				Extract<GenericOutput, CutStepFunctionOutput>,
				never
			> extends true
				? GenericFloor
				: (
					GenericOutput extends infer InferredOutputData extends CutStepFunctionOutput
						? O.AssignObjects<
							GenericFloor,
							Unwrap<InferredOutputData>
						>
						: never
				),
			GenericRequest
		>;
	}
}

processBuilder.set(
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
