import { createHttpClient } from "@duplojs/http/client";
import { type Routes } from "./types";

const client = createHttpClient<Routes>({
	baseUrl: "http://localhost:1506",
});

await client
	.get(
		"/hello-world",
		{ query: { name: "math" } },
	)
	.whenInformation(
		"helloWorld.send",
		({ body }) => {
		// ^?


		},
	)
	.whenInformation(
		"extract-error",
		({ code }) => {
		// ^?


		},
	);

