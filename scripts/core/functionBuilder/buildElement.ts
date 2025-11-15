import { asyncPipe, E, forward, G, justReturn, P, when } from "@duplojs/utils";
import { type BuildSuccessEither, type BuildErrorEither, type BuildParamsFunctionBuilder, type createFunctionBuilder, type ElementsToBeBuilt, type FunctionBuilderResult } from "./create";
import { stepKind, type Steps } from "@core/steps";
import { type Process, processKind } from "@core/process";
import { type HookRouteLifeCycle } from "@core/route";
import { type Environment } from "@core/types";

export interface BuildElementParams {
	readonly environment: Environment;
	readonly globalHooksRouteLifeCycle: readonly HookRouteLifeCycle[];
	readonly processFunctionBuilders: readonly ReturnType<typeof createFunctionBuilder<Process>>[];
	readonly stepFunctionBuilders: readonly (
		Steps extends infer InferredSteps
			? InferredSteps extends Steps
				? ReturnType<typeof createFunctionBuilder<Steps>>
				: never
			: never
	)[];
}

export function buildElement<
	GenericElement extends ElementsToBeBuilt,
>(
	element: GenericElement,
	params: BuildElementParams,
	functionBuilders: readonly ReturnType<typeof createFunctionBuilder<GenericElement>>[],
): Promise<BuildErrorEither | BuildSuccessEither<GenericElement>> {
	const functionBuilderParams: BuildParamsFunctionBuilder<GenericElement> = {
		success(value) {
			return E.right("successBuild", value as never);
		},
		buildElement(value) {
			return asyncPipe(
				forward<Process | Steps>(value),
				P.when(
					stepKind.has,
					(step) => buildElement(
						step as never,
						functionBuilderParams as never,
						params.stepFunctionBuilders as never,
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
			when(
				E.isRight,
				exit,
			),
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
