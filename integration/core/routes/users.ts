import { ResponseContract, useRouteBuilder } from "@duplojs/http";
import { DPE } from "@duplojs/utils";

const user = DPE.object({
	id: DPE.number(),
	name: DPE.string(),
	age: DPE.number(),
});

useRouteBuilder("GET", "/users")
	.handler(
		ResponseContract.ok("users.findMany", user.array()),
		(floor, { response }) => response("users.findMany", [
			{
				id: 23,
				name: "",
				age: 28,
			},
		]),
	);

useRouteBuilder("GET", "/users/{userId}")
	.extract({
		params: {
			userId: DPE.coerce.number(),
		},
	})
	.handler(
		ResponseContract.ok("users.find", user),
		(floor, { response }) => response("users.find", {
			id: floor.userId,
			name: "",
			age: 28,
		}),
	);

useRouteBuilder("POST", "/users")
	.extract({
		body: user,
	})
	.handler(
		ResponseContract.ok("users.create", user),
		(floor, { response }) => response("users.create", floor.body),
	);
