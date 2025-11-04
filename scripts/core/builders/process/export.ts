import { type Floor } from "@core/floor";
import { type SimplifyTopLevel, type IsEqual, type Or } from "@duplojs/utils";
import { processBuilder } from "./builder";
import { type Process, type ProcessExportValue, type ProcessDefinition, createProcess, type ProcessRequest } from "@core/process";
import { type Request } from "@core/request";

declare module "./builder" {
	interface ProcessBuilder<
		GenericDefinition extends ProcessDefinition = ProcessDefinition,
		GenericFloor extends Floor = {},
		GenericRequest extends Request = Request,
	> {
		export<
			GenericExportation extends (keyof GenericFloor)[] = never,
		>(
			exportedKey?: GenericExportation
		): Process<
			SimplifyTopLevel<
				& GenericDefinition
				& (
					Or<[
						IsEqual<GenericExportation, never>,
						IsEqual<GenericExportation, never[]>,
					]> extends true
						? {}
						: ProcessExportValue<
							SimplifyTopLevel<
								Pick<
									GenericFloor,
									GenericExportation[number]
								>
							>
						>
				)
				& (
					IsEqual<GenericRequest, Request> extends true
						? {}
						: ProcessRequest<GenericRequest>
				)
			>
		>;
	}
}

processBuilder.set(
	"export",
	({
		accumulator,
	}) => createProcess(accumulator),
);
