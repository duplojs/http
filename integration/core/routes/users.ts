import { ResponseContract, useRouteBuilder } from "@duplojs/http";
import { createCacheControllerHooks } from "@duplojs/http/cacheController";
import { DPE } from "@duplojs/utils";

interface User {
	id: number;
	name: string;
	age: number;
	friends?: User[];
}

const user: DPE.DataParserExtended<User> = DPE.object({
	id: DPE.number().setIdentifier("UserId"),
	name: DPE.string().setIdentifier("UserName"),
	age: DPE.number(),
	friends: DPE.lazy(() => user).array().optional(),
}).contractExtended<User>().setIdentifier("User");

useRouteBuilder("GET", "/users", {
	hooks: [
		createCacheControllerHooks({
			private: ["authorization", "cookie"],
			noCache: ["set-cookie"],
			maxAge: 200,
		}),
	],
})
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

useRouteBuilder("DELETE", "/users")
	.extract({
		body: {
			id: DPE.coerce.number(),
		},
	})
	.handler(
		ResponseContract.noContent("users.deleted"),
		(__, { response }) => response("users.deleted"),
	);
