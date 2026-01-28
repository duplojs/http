import { createHttpClient } from "@duplojs/http/client";

export type Routes = {
	method: "GET";
	path: "/hello-world";
	query: {
		name: string;
	};
	responses: {
		code: "422";
		information: "extract-error";
		body?: undefined;
	} | {
		code: "200";
		information: "helloWorld.send";
		body: string;
	};
};

const client = createHttpClient<Routes>({
	baseUrl: "http://localhost:1506",
});

// @ts-expect-error autocomplete arguments
// @noErrors
await client.get("");
//                ^|


