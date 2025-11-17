import { processKind } from "@core/process";
import { createFunctionBuilder } from "../create";
import { buildSteps } from "./route";
import { A, E } from "@duplojs/utils";
import { type Floor } from "@core/floor";
import { Response } from "@core/response";

export const processFunctionBuilder = createFunctionBuilder(
	(element, { support, notSupport }) => processKind.has(element)
		? support(element)
		: notSupport(),
	async(process, { success, buildElement }) => {
		const {
			steps,
			hooks,
			options: processOptions,
		} = process.definition;

		const maybeBuildedSteps = await buildSteps(
			steps,
			buildElement,
		);

		if (E.isLeft(maybeBuildedSteps)) {
			return maybeBuildedSteps;
		}

		const buildedSteps = maybeBuildedSteps;

		return success({
			buildedFunction: async(request, options = processOptions) => {
				let floor: Floor = { options };

				// eslint-disable-next-line @typescript-eslint/prefer-for-of
				for (let index = 0; index < buildedSteps.length; index++) {
					const result = await buildedSteps[index]!.buildedFunction(request, floor);

					if (result instanceof Response) {
						return result;
					}

					floor = result;
				}

				return floor;
			},
			hooksRouteLifeCycle: A.concat(
				hooks,
				A.flatMap(
					buildedSteps,
					({ hooksRouteLifeCycle }) => hooksRouteLifeCycle,
				),
			),
		});
	},
);
