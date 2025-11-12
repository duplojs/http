import { type BuildParamsFunctionBuilder, type FunctionBuilderResult } from "@core/functionBuilder/createFunctionBuilder";
import { type Steps } from "@core/steps";
import { A, E, pipe, when } from "@duplojs/utils";

export function buildSteps(
	steps: readonly Steps[],
	buildElement: BuildParamsFunctionBuilder["buildElement"],
) {
	return A.reduce(
		steps,
		A.reduceFrom<FunctionBuilderResult<Steps>[]>([]),
		({ lastValue, element, next, exit }) => pipe(
			buildElement(element),
			when(
				E.isLeft,
				exit,
			),
			E.whenIsRight(
				(buildedStep) => next(
					A.push(lastValue, buildedStep),
				),
			),
		),
	);
}
