import { type BuildParamsFunctionBuilder, type FunctionBuilderResult } from "@core/functionBuilder/create";
import { type Steps } from "@core/steps";
import { A, asyncPipe, E, G, when } from "@duplojs/utils";

export function buildSteps(
	steps: readonly Steps[],
	buildElement: BuildParamsFunctionBuilder["buildElement"],
) {
	return G.asyncReduce(
		steps,
		G.reduceFrom<FunctionBuilderResult<Steps>[]>([]),
		({ lastValue, element, next, exit }) => asyncPipe(
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
