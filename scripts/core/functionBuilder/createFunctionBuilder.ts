import { type HubEnvironment } from "@core/hub";
import { type BuildedProcess, type Process } from "@core/process";
import { type HookRouteLifeCycle, type BuildedRoute, type Route } from "@core/route";
import { type BuildedStep, type Steps } from "@core/steps";
import { E, pipe } from "@duplojs/utils";

type Element = (
	| Steps
	| Route
	| Process
);

export type FunctionBuilderResult<
	GenericElement extends Element,
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

type SupportEither<
	GenericElement extends Element,
> = E.EitherRight<"support", GenericElement>;

type NotSupportEither = E.EitherLeft<"notSupport", undefined>;

type BuildErrorEither = E.EitherLeft<"buildError", Element>;

type BuildedEither<
	GenericElement extends Element,
> = E.EitherRight<
	"successBuild",
	FunctionBuilderResult<
		GenericElement
	>
>;

export interface BuildParamsFunctionBuilder<
	GenericSupportElement extends Element = Element,
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

	readonly hooksRouteLifeCycle: readonly HookRouteLifeCycle[];
}

export interface SupportParams {
	support<
		GenericElement extends Element,
	>(
		value: GenericElement
	): SupportEither<GenericElement>;
	notSupport(): NotSupportEither;
}

const supportParams: SupportParams = {
	support: (value) => E.right("support", value),
	notSupport: () => E.left("notSupport"),
};

export function createFunctionBuilder<
	GenericSupportElement extends Element,
>(
	support: (
		element: Element,
		params: SupportParams,
	) => SupportEither<GenericSupportElement> | NotSupportEither,
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
		element: Element,
		params: BuildParamsFunctionBuilder<GenericSupportElement>,
	) => pipe(
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
