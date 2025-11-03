import { type Kind, type DP, pipe } from "@duplojs/utils";
import { createCoreLibKind } from "./kind";
import { type ResponseCode, type Response } from "./response";

export namespace ResponseContract {
	export const contractKind = createCoreLibKind("response-contract");

	export interface Contract<
		GenericCode extends ResponseCode = ResponseCode,
		GenericInformation extends string = string,
		GenericSchema extends DP.DataParser = DP.DataParser,
	> extends Kind<typeof contractKind.definition> {
		code: GenericCode;
		information: GenericInformation;
		schema: GenericSchema;
	}

	export type Convert<
		GenericContract extends Contract,
	> = GenericContract extends Contract
		? Response<
			GenericContract["code"],
			GenericContract["information"],
			DP.Input<GenericContract["schema"]>
		>
		: never;

	export function ok<
		GenericInformation extends string,
		GenericSchema extends DP.DataParser,
	>(
		information: GenericInformation,
		schema: GenericSchema,
	): Contract<
			"200",
			GenericInformation,
			GenericSchema
		> {
		return pipe(
			{
				code: "200" as const,
				information,
				schema,
			},
			contractKind.setTo,
		);
	}

	export function unprocessableEntity<
		GenericInformation extends string,
		GenericSchema extends DP.DataParser,
	>(
		information: GenericInformation,
		schema: GenericSchema,
	): Contract<
			"422",
			GenericInformation,
			GenericSchema
		> {
		return pipe(
			{
				code: "422" as const,
				information,
				schema,
			},
			contractKind.setTo,
		);
	}
}
