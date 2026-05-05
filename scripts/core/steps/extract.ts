import { createCoreLibKind } from "@core/kind";
import { type DP, pipe, type Kind, type O, type AnyFunction } from "@duplojs/utils";
import { type StepKind, stepKind } from "./kind";
import { type Request } from "@core/request";
import { type ClientErrorResponseCode, type ResponseContract } from "@core/response";
import { type Metadata } from "@core/metadata";

export interface DisabledExtractKeysCustom {

}

export type DisabledExtractKeys = O.GetPropsWithValue<
	DisabledExtractKeysCustom,
	true
>;

export type ExtractShape<
	GenericRequest extends Request = Request,
> = Partial<
	& Record<
		Exclude<
			keyof GenericRequest,
			| O.GetPropsWithValueExtends<
				GenericRequest,
				AnyFunction
			>
			// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
			| DisabledExtractKeys
			| "body"
			| "bodyReader"
			| "params"
			| symbol
		>,
		| DP.DataParser
		| Record<string, DP.DataParser>
	>
	& {
		body: (
			| DP.DataParser
			| Record<string, DP.DataParser>
		);
		params: Record<string, DP.DataParser>;
	}
>;

export interface ExtractStepDefinition {
	readonly shape: ExtractShape;
	readonly responseContract?: ResponseContract.Contract<ClientErrorResponseCode, string, DP.DataParserEmpty>;
	readonly metadata: readonly Metadata[];
}

export const extractStepKind = createCoreLibKind("extract-step");

export type _ExtractStep = (
	& Kind<typeof extractStepKind.definition>
	& StepKind
);

export interface ExtractStep<
	GenericDefinition extends ExtractStepDefinition = ExtractStepDefinition,
> extends _ExtractStep {
	readonly definition: GenericDefinition;
}

export function createExtractStep<
	GenericDefinition extends ExtractStepDefinition,
>(
	definition: GenericDefinition,
): ExtractStep<GenericDefinition> {
	return pipe(
		{ definition },
		extractStepKind.setTo,
		stepKind.setTo,
	);
}
