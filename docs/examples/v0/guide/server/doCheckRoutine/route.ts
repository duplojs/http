import { ResponseContract, useRouteBuilder } from "@duplojs/http";
import { authenticationProcess } from "./process";
import { userSchema } from "./schema";

useRouteBuilder("GET", "/some-action")
	.exec(authenticationProcess, { imports: ["user"] })
	.handler(
		ResponseContract.ok("some-information.send", userSchema),
		({ user }, { response }) => response("some-information.send", user),
	);
