import { type Floor } from "@core/floor";
import { type RouteDefinition } from "@core/route";
import { createProcessStep, type ProcessStep } from "@core/steps";
import { type O, type NeverCoalescing, type FixDeepFunctionInfer, type Adaptor, type AnyFunction } from "@duplojs/utils";
import { routeBuilder } from "./builder";
import { type GetProcessRequest, type GetProcessExportValue, type Process } from "@core/process";
import { type Request } from "@core/request";

declare module "./builder" {
	interface RouteBuilder<
		GenericDefinition extends RouteDefinition = RouteDefinition,
		GenericFloor extends Floor = {},
		GenericRequest extends Request = Request,
	> {
		exec<
			GenericProcess extends Process,
			GenericProcessExportValue extends GetProcessExportValue<GenericProcess>,
			const GenericImportation extends readonly Extract<keyof GenericProcessExportValue, string>[] = never,
			GenericOptions extends (
				| GenericProcess["definition"]["options"]
				| ((floor: GenericFloor) => Exclude<GenericProcess["definition"]["options"], undefined>)
			) = never,
		>(
			process: GenericProcess,
			params?: {
				readonly imports?: GenericImportation;
				readonly options?: FixDeepFunctionInfer<
					| GenericProcess["definition"]["options"]
					| ((floor: GenericFloor) => GenericProcess["definition"]["options"]),
					GenericOptions
				>;
			},
		): RouteBuilder<
			O.AssignObjects<
				GenericDefinition,
				{
					readonly steps: readonly [
						...GenericDefinition["steps"],
						ProcessStep<
							{
								readonly process: GenericProcess;
								readonly options: NeverCoalescing<
									Adaptor<GenericOptions, AnyFunction | GenericProcess["definition"]["options"]>,
									undefined
								>;
								readonly imports: NeverCoalescing<GenericImportation, undefined>;
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

routeBuilder.set(
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
