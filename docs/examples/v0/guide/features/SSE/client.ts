import { createHttpClient } from "@duplojs/http/client";
import { type Routes } from "./types";

const client = createHttpClient<Routes>({
	baseUrl: "http://localhost:1506",
});

const response = await client.get(
	"/some-route",
	{ headers: { superToken: "valid-token" } },
).iWantInformationOrThrow("SSE");

response.onReceiveEvent("message", (event) => {
//                                   ^?









});

response.onReceiveEvent("otherEvent", (event) => {
	// ...
});

// start consume SSE
for await (const event of response) {
	// ...
}
// or
void response.consumeEventStream();
