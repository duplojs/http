import { createHttpClient } from "@duplojs/http/client";
import { type Routes } from "./types";

const client = createHttpClient<Routes>({
	baseUrl: "http://localhost:1506",
});

const promiseRequestCreateUser = client
	.post(
		"/users",
		{
			body: {
				username: "math",
				age: 23,
			},
		},
	);

// @ts-expect-error select good path
// @noErrors
const promiseRequest = client.post("");
//                                  ^|


// and good params
const promiseRequestFindManyPost = client
	.get(
		"/posts",
		{ query: { page: "3" } },
	);
