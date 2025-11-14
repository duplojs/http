import { processStepKind } from "@core/steps";
import { Response } from "@core/response";
import { createFunctionBuilder } from "../create";
import { E, forward, isType, or, P, pipe, unwrap } from "@duplojs/utils";

export const processStepFunctionBuilder = createFunctionBuilder(
	(element, { support, notSupport }) => processStepKind.has(element)
		? support(element)
		: notSupport(),
	(step, { success, buildElement }) => {
		const {
			process,
			imports,
			options: stepOptions,
		} = step.definition;

		const maybeProcessBuilded = buildElement(process);

		if (E.isLeft(maybeProcessBuilded)) {
			return maybeProcessBuilded;
		}

		const processBuilded = unwrap(maybeProcessBuilded);

		const getOptions = pipe(
			stepOptions,
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
				const result = await processBuilded.buildedFunction(
					request,
					getOptions(floor),
				);

				if (result instanceof Response) {
					return result;
				} else if (imports) {
					const newFloor = { ...floor };

					// eslint-disable-next-line @typescript-eslint/prefer-for-of
					for (let index = 0; index < imports.length; index++) {
						newFloor[imports[index] as never] = result[imports[index] as never];
					}

					return newFloor;
				}

				return floor;
			},
			hooksRouteLifeCycle: processBuilded.hooksRouteLifeCycle,
		});
	},
);
