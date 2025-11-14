import { asyncPipe, E, forward, G, justReturn, P, pipe, when } from "@duplojs/utils";
import { type BuildErrorEither, type BuildParamsFunctionBuilder, type createFunctionBuilder, type ElementsToBeBuilt, type FunctionBuilderResult } from "./create";
import { stepKind, type Steps } from "@core/steps";
import { type Process, processKind } from "@core/process";
import { type HookRouteLifeCycle } from "@core/route";
import { type HubEnvironment } from "@core/hub";

export interface ParamsCreateFunctionBuilderParams {
	readonly environment: HubEnvironment;
	readonly globalHooksRouteLifeCycle: readonly HookRouteLifeCycle[];
	readonly processFunctionBuilders: readonly ReturnType<typeof createFunctionBuilder<Process>>[];
	readonly stepFunctionBuilders: readonly ReturnType<typeof createFunctionBuilder<Steps>>[];
}

export function buildElement<
	GenericElement extends ElementsToBeBuilt,
>(
	element: GenericElement,
	params: ParamsCreateFunctionBuilderParams,
	functionBuilders: readonly ReturnType<typeof createFunctionBuilder<GenericElement>>[],
): Promise<BuildErrorEither | FunctionBuilderResult<GenericElement>> {
	const functionBuilderParams: BuildParamsFunctionBuilder<GenericElement> = {
		success(value) {
			return E.right("successBuild", value as never);
		},
		buildElement(value) {
			return pipe(
				forward<Process | Steps>(value),
				P.when(
					stepKind.has,
					(step) => buildElement(
						step,
						functionBuilderParams as never,
						params.stepFunctionBuilders,
					),
				),
				P.when(
					processKind.has,
					(process) => buildElement(
						process,
						functionBuilderParams as never,
						params.processFunctionBuilders,
					),
				),
				P.exhaustive,
			) as never;
		},
		environment: params.environment,
		globalHooksRouteLifeCycle: params.globalHooksRouteLifeCycle,
	};

	return G.asyncReduce(
		functionBuilders,
		G.reduceFrom<BuildErrorEither>(E.left("buildError", element)),
		({
			element: functionBuilder,
			lastValue,
			next,
			exit,
		}) => asyncPipe(
			functionBuilder(element, functionBuilderParams),
			E.whenIsRight(exit),
			E.whenHasInformation(
				"notSupport",
				justReturn(next(lastValue)),
			),
			when(
				E.hasInformation("buildError"),
				exit,
			),
		),
	);
}
