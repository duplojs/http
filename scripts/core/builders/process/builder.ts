import { type ProcessDefinition } from "@core/process";
import { type Floor } from "@core/floor";
import { type Builder, createBuilder, type IsEqual, type NeverCoalescing } from "@duplojs/utils";
import { type HookRouteLifeCycle } from "@core/route";
import { createCoreLibStringIdentifier } from "@core/stringIdentifier";
import { type Metadata } from "@core/metadata";

export interface ProcessBuilder<
	GenericDefinition extends ProcessDefinition = ProcessDefinition,
	GenericFloor extends Floor = {},
> extends Builder<ProcessDefinition> {

}

export const processBuilder = createBuilder<ProcessBuilder>(
	createCoreLibStringIdentifier("process"),
);

export function useProcessBuilder<
	GenericOptions extends ProcessDefinition["options"] = never,
	const GenericHooks extends readonly HookRouteLifeCycle[] = readonly [],
	const GenericMetadata extends readonly Metadata[] = readonly [],
>(
	params?: {
		options?: GenericOptions;
		hooks?: GenericHooks | readonly HookRouteLifeCycle[];
		metadata?: GenericMetadata;
	},
): ProcessBuilder<
		{
			readonly steps: readonly [];
			readonly options: NeverCoalescing<GenericOptions, undefined>;
			readonly hooks: GenericHooks;
			readonly metadata: GenericMetadata;
		},
		IsEqual<GenericOptions, never> extends true
			? {}
			: { options: GenericOptions }
	> {
	return processBuilder.use({
		options: undefined,
		...params,
		steps: [],
		hooks: params?.hooks ?? [],
		metadata: params?.metadata ?? [],
	});
}
