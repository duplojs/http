import { type HubEnvironment } from "@core/hub";
import { type BuildedProcess, type Process } from "@core/process";
import { type BuildedRoute, type Route } from "@core/route";
import { type BuildedStep, type Steps } from "@core/steps";
import { E, pipe, type A } from "@duplojs/utils";

type Element = (
	| Steps
	| Route
	| Process
);

type BuildedResult<
	GenericElement extends Element,
> = A.ExtractTuple<
	| [Steps, BuildedStep]
	| [Route, BuildedRoute]
	| [Process, BuildedProcess],
	[GenericElement, any]
>[1];

type SupportEither<
	GenericElement extends Element,
> = E.EitherRight<"support", GenericElement>;

type NotSupportEither = E.EitherLeft<"notSupport", undefined>;

type BuildErrorEither = E.EitherLeft<"buildError", Element>;

type BuildedEither<
	GenericElement extends Element,
> = E.EitherRight<
	"successBuild",
	BuildedResult<
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
		result: BuildedResult<GenericSupportElement>
	): BuildedEither<GenericSupportElement>;

	readonly environment: HubEnvironment;
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
