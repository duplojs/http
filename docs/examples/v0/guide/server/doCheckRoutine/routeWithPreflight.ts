import { ResponseContract } from "@duplojs/http";
import { useAuthenticatedRouteBuilder } from "./authenticatedRouteBuilder";
import { userSchema } from "./schema";

useAuthenticatedRouteBuilder("GET", "/some-action")
	.handler(
		ResponseContract.ok("some-information.send", userSchema),
		({ user }, { response }) => response("some-information.send", user),
	);
