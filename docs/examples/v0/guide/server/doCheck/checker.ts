import { useCheckerBuilder } from "@duplojs/http";
import { findOneUser } from "./findOneUser";

export const userExist = useCheckerBuilder({ options: { someOption: "" } })
	.handler(
		async(input: number, { output, options: { someOption } }) => {
			const user = await findOneUser(input);

			if (user) {
				return output("user.find", user);
			} else {
				return output("user.notfound", null);
			}
		},
	);
