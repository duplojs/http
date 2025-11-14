import { type HubEnvironment } from "@core/hub";
import { type BuildedProcess, type Process } from "@core/process";
import { type HookRouteLifeCycle, type BuildedRoute, type Route } from "@core/route";
import { type BuildedStep, type Steps } from "@core/steps";
import { asyncPipe, E, type MaybePromise } from "@duplojs/utils";

export type ElementsToBeBuilt = (
	| Steps
	| Route
	| Process
);

export type FunctionBuilderResult<
	GenericElement extends ElementsToBeBuilt,
> = Extract<
	| (
		Steps extends infer InferredStep
			? InferredStep extends Steps
				? {
					element: InferredStep;
					value: {
						readonly buildedFunction: BuildedStep;
						readonly hooksRouteLifeCycle: HookRouteLifeCycle[];
					};
				}
				: never
			: never
	)
	| {
		element: Process;
		value: {
			readonly buildedFunction: BuildedProcess;
			readonly hooksRouteLifeCycle: HookRouteLifeCycle[];
		};
	}
	| {
		element: Route;
		value: BuildedRoute;
	},
	{
		element: GenericElement;
	}
>["value"];

export type BuildSupportEither<
	GenericElement extends ElementsToBeBuilt,
> = E.EitherRight<"support", GenericElement>;

export type BuildNotSupportEither = E.EitherLeft<"notSupport", undefined>;

export type BuildErrorEither = E.EitherLeft<"buildError", ElementsToBeBuilt>;

export type BuildedEither<
	GenericElement extends ElementsToBeBuilt,
> = E.EitherRight<
	"successBuild",
	FunctionBuilderResult<
		GenericElement
	>
>;

export interface BuildParamsFunctionBuilder<
	GenericSupportElement extends ElementsToBeBuilt = ElementsToBeBuilt,
> {
	buildElement<
		GenericElement extends (
			| Process
			| Steps
		),
	>(
		element: GenericElement
	): (
		| BuildedEither<
			GenericElement
		>
		| BuildErrorEither
	);

	success(
		result: FunctionBuilderResult<GenericSupportElement>
	): BuildedEither<GenericSupportElement>;

	readonly environment: HubEnvironment;

	readonly globalHooksRouteLifeCycle: readonly HookRouteLifeCycle[];
}

export interface SupportParams {
	support<
		GenericElement extends ElementsToBeBuilt,
	>(
		value: GenericElement
	): BuildSupportEither<GenericElement>;
	notSupport(): BuildNotSupportEither;
}

const supportParams: SupportParams = {
	support: (value) => E.right("support", value),
	notSupport: () => E.left("notSupport"),
};

export function createFunctionBuilder<
	GenericSupportElement extends ElementsToBeBuilt,
>(
	support: (
		element: ElementsToBeBuilt,
		params: SupportParams,
	) => MaybePromise<BuildSupportEither<GenericSupportElement> | BuildNotSupportEither>,
	builder: (
		element: GenericSupportElement,
		params: BuildParamsFunctionBuilder<
			GenericSupportElement
		>,
	) => (
		| BuildedEither<GenericSupportElement>
		| BuildErrorEither
	),
) {
	return (
		element: ElementsToBeBuilt,
		params: BuildParamsFunctionBuilder<GenericSupportElement>,
	) => asyncPipe(
		element,
		(element) => support(
			element,
			supportParams,
		),
		E.whenIsRight(
			(element) => builder(
				element,
				params,
			),
		),
	);
}
