import { createHttpClient } from "@duplojs/http/client";
import { type Routes } from "./types";

const client = createHttpClient<Routes>({
	baseUrl: "http://localhost:1506",
});

const binaryResponse = await client
	.get("/binary-stream")
	.iWantInformationOrThrow("binary-stream");

binaryResponse.onStream("receiveData", (chunk) => {
//                                         ^?

});

for await (const chunk of binaryResponse) {
	// ...
}

const textResponse = await client
	.post(
		"/text-stream",
		{ body: { value: "world" } },
	)
	.iWantInformationOrThrow("text-stream");

textResponse.onStream("receiveData", (chunk) => {
//                                       ^?

});

void textResponse.consumeStream();
