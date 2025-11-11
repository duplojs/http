import { type CheckerFunctionParams, checkerOutputKind } from "@core/checker";
import { createFunctionBuilder } from "../createFunctionBuilder";
import { checkerStepKind } from "@core/steps";
import { forward, isType, or, P, pipe } from "@duplojs/utils";
import { type Floor } from "@core/floor";
import { Response } from "@core/response";

export const checkerFunctionBuilder = createFunctionBuilder(
	(element, { support, notSupport }) => checkerStepKind.has(element)
		? support(element)
		: notSupport(),
	(step, { success }) => {
		const {
			checker: {
				definition: {
					options: checkerOptions,
					theFunction: checkerFunction,
				},
			},
			input,
			responseContract,
			result: stepResult,
			indexing,
			options: stepOptions,
		} = step.definition;

		const getOptions = pipe(
			stepOptions ?? checkerOptions,
			P.when(
				or([
					isType("object"),
					isType("undefined"),
				]),
				(options) => (() => options),
			),
			P.otherwise(forward),
		);

		const output: CheckerFunctionParams["output"] = (
			information,
			value,
		) => checkerOutputKind.setTo({
			information,
			value,
		});

		const expectedResult = pipe(
			stepResult,
			P.when(
				isType("string"),
				(expectedInformation) => ((information: string) => information === expectedInformation),
			),
			P.otherwise(
				(expectedInformation) => ((information: string) => expectedInformation.includes(information)),
			),
		);

		function getResponse() {
			return new Response(
				responseContract.code,
				responseContract.information,
				undefined,
			);
		}

		function treatResult(
			output: ReturnType<CheckerFunctionParams["output"]>,
			floor: Floor,
		) {
			if (!expectedResult(output.information)) {
				return getResponse();
			}

			if (indexing) {
				return {
					...floor,
					[indexing]: output.value,
				};
			}

			return floor;
		}

		return success(
			(_request, floor) => {
				const result = checkerFunction(
					input(floor),
					{
						options: getOptions(floor),
						output,
					},
				);

				if (result instanceof Promise) {
					return result.then(
						(awaitedResult) => treatResult(awaitedResult, floor),
					);
				}

				return treatResult(result, floor);
			},
		);
	},
);
