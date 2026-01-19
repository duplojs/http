import { type DP } from "@duplojs/utils";

declare const SymbolForbiddenBigintDataParser: unique symbol;

export type ForbiddenBigintDataParser<
	GenericDataParser extends DP.DataParser,
> = DP.Contain<GenericDataParser, DP.DataParserBigInt<any>> extends true
	? { [SymbolForbiddenBigintDataParser]: "Bigint dataParser is not supported." }
	: unknown;
