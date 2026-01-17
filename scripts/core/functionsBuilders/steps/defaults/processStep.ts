import { processStepKind, type Steps } from "@core/steps";
import { PredictedResponse } from "@core/response";
import { type BuildStepResult, createStepFunctionBuilder, type StepFunctionBuilderParams } from "../create";
import { A, E, forward, G, isType, or, P, pipe, unwrap } from "@duplojs/utils";
import { type Floor } from "@core/floor";

export function buildStepsFunction(
	steps: readonly Steps[],
	buildStep: StepFunctionBuilderParams["buildStep"],
) {
	return G.asyncReduce(
		steps,
		G.reduceFrom<BuildStepResult[]>([]),
		async({ lastValue, element: step, next, exit }) => {
			const result = await buildStep(step);

			if (E.isLeft(result)) {
				return exit(result);
			}

			return next(
				A.push(lastValue, unwrap(result)),
			);
		},
	);
}

export const defaultProcessStepFunctionBuilder = createStepFunctionBuilder(
	processStepKind.has,
	async(step, { success, buildStep }) => {
		const {
			process,
			imports,
			options: stepOptions,
		} = step.definition;

		const {
			steps,
			hooks: processHook,
			options: processOptions,
		} = process.definition;

		const maybeBuildedSteps = await buildStepsFunction(
			steps,
			buildStep,
		);

		if (E.isLeft(maybeBuildedSteps)) {
			return maybeBuildedSteps;
		}

		const buildedSteps = maybeBuildedSteps;

		const getOptions = pipe(
			stepOptions ?? processOptions,
			P.when(
				or([
					isType("object"),
					isType("undefined"),
				]),
				(options) => (() => options),
			),
			P.otherwise(forward),
		);

		return success({
			buildedFunction: async(request, floor) => {
				let processFloor: Floor = { options: getOptions(floor) };

				// eslint-disable-next-line @typescript-eslint/prefer-for-of
				for (let index = 0; index < buildedSteps.length; index++) {
					const result = await buildedSteps[index]!.buildedFunction(request, floor);

					if (result instanceof PredictedResponse) {
						return result;
					}

					processFloor = result;
				}

				if (imports) {
					const newFloor = { ...floor };

					// eslint-disable-next-line @typescript-eslint/prefer-for-of
					for (let index = 0; index < imports.length; index++) {
						newFloor[imports[index] as never] = processFloor[imports[index] as never];
					}

					return newFloor;
				}

				return floor;
			},
			hooksRouteLifeCycle: [
				...processHook,
				...A.flatMap(
					buildedSteps,
					({ hooksRouteLifeCycle }) => hooksRouteLifeCycle,
				),
			],
		});
	},
);
