import { type Floor } from "@core/floor";
import { createPresetCheckerStep, type PresetCheckerStep } from "@core/steps";
import { type O, type A } from "@duplojs/utils";
import { processBuilder } from "./builder";
import { type Request } from "@core/request";
import { type GetPresetCheckerIndex, type GetPresetCheckerInformation, type GetPresetCheckerResult, type GetPresetCheckerInput, type PresetChecker } from "@core/presetChecker";
import { type ProcessDefinition } from "@core/process";

declare module "./builder" {
	interface ProcessBuilder<
		GenericDefinition extends ProcessDefinition = ProcessDefinition,
		GenericFloor extends Floor = {},
		GenericRequest extends Request = Request,
	> {
		presetCheck<
			GenericPresetChecker extends PresetChecker,
			GenericInput extends GetPresetCheckerInput<GenericPresetChecker>,
		>(
			presetChecker: GenericPresetChecker,
			input: (floor: GenericFloor) => GenericInput,
		): ProcessBuilder<
			O.AssignObjects<
				GenericDefinition,
				{
					readonly steps: readonly [
						...GenericDefinition["steps"],
						PresetCheckerStep<
							{
								readonly presetChecker: GenericPresetChecker;
								input(floor: GenericFloor): GenericInput;
							}
						>,
					];
				}
			>,
			O.AssignObjects<
				GenericFloor,
				{
					[Prop in GetPresetCheckerIndex<GenericPresetChecker>]: Extract<
						Awaited<GetPresetCheckerResult<GenericPresetChecker>>,
						{
							information: A.ArrayCoalescing<
								GetPresetCheckerInformation<GenericPresetChecker>
							>[number];
						}
					>["value"]
				}
			>,
			GenericRequest
		>;
	}
}

processBuilder.set(
	"presetCheck",
	({
		args: [
			presetChecker,
			input,
		],
		accumulator,
		next,
	}) => next({
		...accumulator,
		steps: [
			...accumulator.steps,
			createPresetCheckerStep({
				presetChecker,
				input,
			}),
		],
	}),
);
