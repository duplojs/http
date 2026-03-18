import { type Floor } from "@core/floor";
import { createCheckerStep, type CheckerStep } from "@core/steps";
import { type O, type MaybeArray, type NeverCoalescing, type FixDeepFunctionInfer, type Adaptor, type AnyFunction, type DP, type A } from "@duplojs/utils";
import { processBuilder } from "./builder";
import { type GetCheckerResult, type Checker, type GetCheckerInput, type GetCheckerOptions } from "@core/checker";
import { type ClientErrorResponseCode, type ResponseContract } from "@core/response";
import { type ProcessDefinition } from "@core/process";
import { type Metadata } from "@core/metadata";

declare module "./builder" {
	interface ProcessBuilder<
		GenericDefinition extends ProcessDefinition = ProcessDefinition,
		GenericFloor extends Floor = {},
	> {
		check<
			GenericChecker extends Checker,
			GenericResultInformation extends MaybeArray<Awaited<GetCheckerResult<GenericChecker>>["information"]>,
			GenericInput extends GetCheckerInput<GenericChecker>,
			GenericResponseContract extends ResponseContract.Contract<
				ClientErrorResponseCode,
				string,
				DP.DataParserEmpty
			>,
			GenericIndex extends string = never,
			GenericOptions extends (
				| GetCheckerOptions<GenericChecker>
				| ((floor: GenericFloor) => Exclude<GetCheckerOptions<GenericChecker>, undefined>)
			) = never,
			const GenericMetadata extends readonly Metadata[] = readonly [],
		>(
			checker: GenericChecker,
			params: {
				input(floor: GenericFloor): GenericInput;
				readonly result: GenericResultInformation;
				readonly indexing?: GenericIndex;
				readonly options?: FixDeepFunctionInfer<
					| GenericChecker["definition"]["options"]
					| ((floor: GenericFloor) => GenericChecker["definition"]["options"]),
					GenericOptions
				>;
				readonly otherwise: GenericResponseContract;
			},
			...metadata: GenericMetadata
		): ProcessBuilder<
			O.AssignObjects<
				GenericDefinition,
				{
					readonly steps: readonly [
						...GenericDefinition["steps"],
						CheckerStep<
							{
								readonly checker: GenericChecker;
								readonly result: GenericResultInformation;
								readonly indexing: NeverCoalescing<GenericIndex, undefined>;
								input(floor: GenericFloor): GenericInput;
								readonly options: NeverCoalescing<
									Adaptor<GenericOptions, AnyFunction | GenericChecker["definition"]["options"]>,
									undefined
								>;
								readonly responseContract: GenericResponseContract;
								readonly metadata: GenericMetadata;
							}
						>,
					];
				}
			>,
			O.AssignObjects<
				GenericFloor,
				{
					[Prop in GenericIndex]: Extract<
						Awaited<GetCheckerResult<GenericChecker>>,
						{
							information: A.ArrayCoalescing<
								GenericResultInformation
							>[number];
						}
					>["value"]
				}
			>
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
			...metadata
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
				metadata,
			}),
		],
	}),
);
