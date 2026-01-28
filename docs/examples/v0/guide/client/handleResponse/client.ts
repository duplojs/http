import { createHttpClient } from "@duplojs/http/client";
import { type Routes } from "./types";

const client = createHttpClient<Routes>({
	baseUrl: "http://localhost:1506",
});

const response = await client
	.get(
		"/posts",
		{ query: { page: "3" } },
	)
	.whenInformation(
		"post.findMany",
		({ body }) => {
		//  ^?







		},
	)
	.whenCode(
		"422",
		({ information }) => {
		//  ^?


		},
	);

const eitherResponse = await client
	.post(
		"/users/{userId}/posts",
		{
			params: { userId: "1" },
			body: {
				title: "Super article",
				content: "Super content of article",
			},
		},
	)
	.iWantInformationOrThrow("post.created");
