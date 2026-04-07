import { createHttpClient } from "@duplojs/http/client";
import { E, unwrap } from "@duplojs/utils";
import { type Routes } from "./types";

const client = createHttpClient<Routes>({
	baseUrl: "http://localhost:1506",
});

const firstUsersRequest = await client.get(
	"/users",
	{ clientCache: "auto" },
);

const secondUsersRequest = await client.get(
	"/users",
	{ clientCache: "auto" },
);

if (E.isRight(secondUsersRequest) && unwrap(secondUsersRequest).fromCache) {
	console.log("Response loaded from cache.");
}

const refreshedUsersRequest = await client.get(
	"/users",
	{
		clientCache: "auto",
		refreshClientCache: true,
	},
);

const bypassedUsersRequest = await client.get(
	"/users",
	{
		clientCache: "auto",
		bypassClientCache: true,
	},
);

const customKeyRequest = await client.get(
	"/users/{userId}",
	{
		params: { userId: "42" },
		clientCache(params) {
			return `user:${params.path}:${params.params?.userId?.toString()}`;
		},
	},
);
