import { type MaybePromise, pipe, type Kind } from "@duplojs/utils";
import { createCoreLibKind } from "./kind";

export const checkerOutputKind = createCoreLibKind("checker-output");

export interface CheckerFunctionOutput<
	GenericInformation extends string = string,
	GenericValue extends unknown = unknown,
> extends Kind<typeof checkerOutputKind.definition> {
	information: GenericInformation;
	value: GenericValue;
}

export interface CheckerFunctionParams<
	GenericOptions extends Record<string, unknown> | undefined = Record<string, unknown> | undefined,
> {
	options: GenericOptions;
	output<
		GenericInformation extends string,
		GenericValue extends unknown,
	>(
		information: GenericInformation,
		value: GenericValue,
	): CheckerFunctionOutput<
		GenericInformation,
		GenericValue
	>;
}

export interface CheckerDefinition {
	theFunction(
		input: unknown,
		params: CheckerFunctionParams
	): MaybePromise<CheckerFunctionOutput>;
	readonly options?: Record<string, unknown>;
}

export const checkerKind = createCoreLibKind("checker");

export interface Checker<
	GenericDefinition extends CheckerDefinition = CheckerDefinition,
> extends Kind<typeof checkerKind.definition> {
	readonly definition: GenericDefinition;
}

export function createChecker<
	GenericDefinition extends CheckerDefinition,
>(
	definition: GenericDefinition,
): Checker<GenericDefinition> {
	return pipe(
		{ definition },
		checkerKind.setTo,
	);
}
