import { DataParserToTypescript } from "@duplojs/data-parser-tools";
import { DP } from "@duplojs/utils";
export declare const fileTransformer: (schema: DP.DataParsers, params: DataParserToTypescript.TransformerParams) => DataParserToTypescript.MaybeTransformerEither;
export declare const dateTransformer: (schema: DP.DataParsers, params: DataParserToTypescript.TransformerParams) => DataParserToTypescript.MaybeTransformerEither;
export declare const timeTransformer: (schema: DP.DataParsers, params: DataParserToTypescript.TransformerParams) => DataParserToTypescript.MaybeTransformerEither;
export declare const typescriptTransformers: ((schema: DP.DataParsers, params: DataParserToTypescript.TransformerParams) => DataParserToTypescript.MaybeTransformerEither)[];
