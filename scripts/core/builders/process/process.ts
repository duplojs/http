import { type Floor } from "@core/floor";
import { createProcessStep, type ProcessStep } from "@core/steps";
import { type O, type NeverCoalescing, type FixDeepFunctionInfer, type Adaptor, type AnyFunction } from "@duplojs/utils";
import { processBuilder } from "./builder";
import { type ProcessDefinition, type GetProcessExportValue, type Process, type GetProcessRequest } from "@core/process";
import { type Request } from "@core/request";

declare module "./builder" {
	interface ProcessBuilder<
		GenericDefinition extends ProcessDefinition = ProcessDefinition,
		GenericFloor extends Floor = {},
		GenericRequest extends Request = Request,
	> {
		exec<
			GenericProcess extends Process,
			GenericProcessExportValue extends GetProcessExportValue<GenericProcess>,
			GenericImportation extends Extract<keyof GenericProcessExportValue, string>[] = never,
			GenericOptions extends (
				| GenericProcess["definition"]["options"]
				| ((floor: GenericFloor) => Exclude<GenericProcess["definition"]["options"], undefined>)
			) = never,
		>(
			process: GenericProcess,
			params?: {
				import?: GenericImportation;
				options?: FixDeepFunctionInfer<
					| GenericProcess["definition"]["options"]
					| ((floor: GenericFloor) => GenericProcess["definition"]["options"]),
					GenericOptions
				>;
			},
		): ProcessBuilder<
			O.AssignObjects<
				GenericDefinition,
				{
					readonly steps: readonly [
						...GenericDefinition["steps"],
						ProcessStep<
							{
								process: GenericProcess;
								options: NeverCoalescing<
									Adaptor<GenericOptions, AnyFunction>,
									undefined
								>;
								import: NeverCoalescing<GenericImportation, undefined>;
							}
						>,
					];
				}
			>,
			O.AssignObjects<
				GenericFloor,
				Pick<
					GenericProcessExportValue,
					GenericImportation[number]
				>
			>,
			GenericRequest & NeverCoalescing<
				GetProcessRequest<GenericProcess>,
				Request
			>
		>;
	}
}

processBuilder.set(
	"exec",
	({
		args: [
			process,
			params,
		],
		accumulator,
		next,
	}) => next({
		...accumulator,
		steps: [
			...accumulator.steps,
			createProcessStep({
				...params,
				process,
			}),
		],
	}),
);
