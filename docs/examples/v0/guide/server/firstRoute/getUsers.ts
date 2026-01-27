import { type DPE, type AnyFunction } from "@duplojs/utils";
import { type userSchema } from "./schema";

export declare const getUsers: AnyFunction<
	[
		params: {
			page: number;
			quantityPerPage: number;
		},
	],
	Promise<DPE.Output<typeof userSchema>[]>
>;
