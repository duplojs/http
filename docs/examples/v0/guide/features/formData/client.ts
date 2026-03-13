import { createHttpClient } from "@duplojs/http/client";
import { type Routes } from "./types";
import { createFormData } from "@duplojs/utils";

const client = createHttpClient<Routes>({
	baseUrl: "http://localhost:1506",
});

await client.post(
	"/documents",
	{
		body: createFormData({
			userId: 10,
			files: [
				{
					alt: "super",
					file: new File([], "superFile.png"),
					description: "Super file.",
				},
				{
					alt: "super 2",
					file: new File([], "jonDo.jpg"),
					description: "Foo bar.",
				},
			],
		}),
	},
).iWantInformationOrThrow("files.receive");
