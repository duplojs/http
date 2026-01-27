import { DPE } from "@duplojs/utils";

export const userSchema = DPE.object({
	firstName: DPE.string(),
	lastName: DPE.string(),
	age: DPE.number(),
});
