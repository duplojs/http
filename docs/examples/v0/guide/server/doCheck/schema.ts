import { DPE } from "@duplojs/utils";

export const userSchema = DPE.object({
	username: DPE.string(),
	id: DPE.number(),
});
