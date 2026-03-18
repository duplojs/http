import { type Floor } from "@core/floor";
import { type SimplifyTopLevel, type IsEqual, type Or } from "@duplojs/utils";
import { processBuilder } from "./builder";
import { type Process, type ProcessExportValue, type ProcessDefinition, createProcess } from "@core/process";

declare module "./builder" {
	interface ProcessBuilder<
		GenericDefinition extends ProcessDefinition = ProcessDefinition,
		GenericFloor extends Floor = {},
	> {
		exports<
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
			>
		>;
	}
}

processBuilder.set(
	"exports",
	({
		accumulator,
	}) => createProcess(accumulator),
);
