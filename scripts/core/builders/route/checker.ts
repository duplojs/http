import { type Floor } from "@core/floor";
import { type RouteDefinition } from "@core/route";
import { createCheckerStep, type CheckerStep } from "@core/steps";
import { type O, type MaybeArray, type NeverCoalescing, type FixDeepFunctionInfer, type Adaptor, type AnyFunction, type DP, type A } from "@duplojs/utils";
import { routeBuilderHandler } from "./builder";
import { type GetCheckerInput, type Checker, type GetCheckerResult, type GetCheckerOptions } from "@core/checker";
import { type ClientErrorResponseCode, type ResponseContract } from "@core/response";
import { type Request } from "@core/request";

declare module "./builder" {
	interface RouteBuilder<
		GenericDefinition extends RouteDefinition = RouteDefinition,
		GenericFloor extends Floor = {},
		GenericRequest extends Request = Request,
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
		): RouteBuilder<
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
			>,
			GenericRequest
		>;
	}
}

routeBuilderHandler.set(
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
