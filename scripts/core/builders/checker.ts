import { type CheckerDefinition, createChecker, type Checker, type CheckerFunctionOutput, type CheckerFunctionParams } from "@core/checker";
import { type Builder, createBuilder, type MaybePromise, type NeverCoalescing } from "@duplojs/utils";

export interface CheckerBuilderParams {
	readonly options?: Record<string, unknown>;
}

export interface CheckerBuilder<
	GenericParams extends CheckerBuilderParams = CheckerBuilderParams,
> extends Builder<CheckerBuilderParams> {
	handler<
		GenericInput extends unknown,
		GenericOutput extends CheckerFunctionOutput,
	>(
		theFunction: (
			input: GenericInput,
			params: CheckerFunctionParams<GenericParams["options"]>,
		) => MaybePromise<GenericOutput>
	): Checker<
		{
			theFunction(
				input: GenericInput,
				params: CheckerFunctionParams<GenericParams["options"]>
			): MaybePromise<GenericOutput>;
			options: GenericParams["options"];
		}
	>;
}

export const checkerBuilder = createBuilder<CheckerBuilder>("@duplojs/http/core/checker");

checkerBuilder.set(
	"handler",
	({
		args: [theFunction],
		accumulator,
	}) => createChecker({
		theFunction,
		options: accumulator.options,
	}),
);

export function useCheckerBuilder<
	GenericOptions extends CheckerDefinition["options"] = never,
>(
	params?: { options?: GenericOptions },
): CheckerBuilder<{
		readonly options: NeverCoalescing<GenericOptions, undefined>;
	}> {
	return checkerBuilder.use({
		options: undefined,
		...params,
	});
}
