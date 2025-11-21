import { type ProcessDefinition } from "@core/process";
import { type Floor } from "@core/floor";
import { type Builder, createBuilder, type IsEqual, type NeverCoalescing } from "@duplojs/utils";
import { type MakeRequestFromHooks, type HookRouteLifeCycle } from "@core/route";
import { type Request } from "@core/request";
import { createCoreLibStringIdentifier } from "@core/stringIdentifier";

export interface ProcessBuilder<
	GenericDefinition extends ProcessDefinition = ProcessDefinition,
	GenericFloor extends Floor = {},
	GenericRequest extends Request = Request,
> extends Builder<ProcessDefinition> {

}

export const processBuilder = createBuilder<ProcessBuilder>(
	createCoreLibStringIdentifier("process"),
);

export function useProcessBuilder<
	GenericOptions extends ProcessDefinition["options"] = never,
	const GenericHooks extends readonly HookRouteLifeCycle[] = readonly [],
>(
	params?: {
		options?: GenericOptions;
		hooks?: GenericHooks | readonly HookRouteLifeCycle[];
	},
): ProcessBuilder<
		{
			readonly steps: readonly [];
			readonly options: NeverCoalescing<GenericOptions, undefined>;
			readonly hooks: GenericHooks;
		},
		IsEqual<GenericOptions, never> extends true
			? {}
			: { options: GenericOptions },
		NeverCoalescing<
			MakeRequestFromHooks<GenericHooks>,
			Request
		>
	> {
	return processBuilder.use({
		options: undefined,
		...params,
		steps: [],
		hooks: params?.hooks ?? [],
	});
}
