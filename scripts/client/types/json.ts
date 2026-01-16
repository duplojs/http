import { type MaybeArray } from "@duplojs/utils";

export type Json = MaybeArray<
	| string
	| undefined
	| boolean
	| number
	| null
	| { [key: string]: Json }
>;
