import { useCheckerBuilder } from "@duplojs/http";
import { findOneUser } from "./findOneUser";

export const userExist = useCheckerBuilder()
	.handler(
		async(input: number, { output }) => {
			const user = await findOneUser(input);

			if (user) {
				return output("user.find", user);
			} else {
				return output("user.notfound", null);
			}
		},
	);
