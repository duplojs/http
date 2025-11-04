import { type Floor } from "@core/floor";
import { createCheckerStep, type CheckerStep } from "@core/steps";
import { type O, type MaybeArray, type NeverCoalescing, type FixDeepFunctionInfer, type Adaptor, type AnyFunction, type DP } from "@duplojs/utils";
import { processBuilder } from "./builder";
import { type Checker } from "@core/checker";
import { type ClientErrorResponseCode, type ResponseContract } from "@core/response";
import { type ProcessDefinition } from "@core/process";
import { type Request } from "@core/request";

declare module "./builder" {
	interface ProcessBuilder<
		GenericDefinition extends ProcessDefinition = ProcessDefinition,
		GenericFloor extends Floor = {},
		GenericRequest extends Request = Request,
	> {
		check<
			GenericChecker extends Checker,
			GenericResult extends MaybeArray<Awaited<ReturnType<GenericChecker["definition"]["theFunction"]>>["information"]>,
			GenericInput extends Parameters<GenericChecker["definition"]["theFunction"]>[0],
			GenericResponseContract extends ResponseContract.Contract<
				ClientErrorResponseCode,
				string,
				DP.DataParserEmpty
			>,
			GenericIndex extends string = never,
			GenericOptions extends (
				| GenericChecker["definition"]["options"]
				| ((floor: GenericFloor) => Exclude<GenericChecker["definition"]["options"], undefined>)
			) = never,
		>(
			checker: GenericChecker,
			params: {
				input(floor: GenericFloor): GenericInput;
				readonly result: GenericResult;
				readonly indexing?: GenericIndex;
				readonly options?: FixDeepFunctionInfer<
					| GenericChecker["definition"]["options"]
					| ((floor: GenericFloor) => GenericChecker["definition"]["options"]),
					GenericOptions
				>;
				readonly otherwise: GenericResponseContract;
			},
		): ProcessBuilder<
			O.AssignObjects<
				GenericDefinition,
				{
					readonly steps: readonly [
						...GenericDefinition["steps"],
						CheckerStep<
							{
								readonly checker: GenericChecker;
								readonly result: GenericResult;
								readonly indexing: NeverCoalescing<GenericIndex, undefined>;
								input(floor: GenericFloor): GenericInput;
								readonly options: NeverCoalescing<
									Adaptor<GenericOptions, AnyFunction | GenericChecker["definition"]["options"]>,
									undefined
								>;
								readonly responseContract: GenericResponseContract;
							}
						>,
					];
				}
			>,
			O.AssignObjects<
				GenericFloor,
				{
					[Prop in GenericIndex]: Extract<
						ReturnType<
							GenericChecker["definition"]["theFunction"]
						>,
						{
							information: GenericResult extends readonly string[]
								? GenericResult[number]
								: GenericResult;
						}
					>["value"]
				}
			>,
			GenericRequest
		>;
	}
}

processBuilder.set(
	"check",
	({
		args: [
			checker,
			{
				otherwise: responseContract,
				...params
			},
		],
		accumulator,
		next,
	}) => next({
		...accumulator,
		steps: [
			...accumulator.steps,
			createCheckerStep({
				...params,
				responseContract,
				checker,
			}),
		],
	}),
);
