import { ResponseContract, useRouteBuilder } from "@duplojs/http";
import { createCacheControllerHooks } from "@duplojs/http/cacheController";
import { DPE } from "@duplojs/utils";

const articleSchema = DPE.object({
	id: DPE.number(),
	title: DPE.string(),
});

useRouteBuilder("GET", "/articles", {
	hooks: [
		createCacheControllerHooks({
			public: true,
			maxAge: 300,
			staleWhileRevalidate: 60,
		}),
	],
})
	.handler(
		ResponseContract.ok("articles.list", articleSchema.array()),
		(__, { response }) => response("articles.list", [
			{
				id: 1,
				title: "Hello",
			},
		]),
	);
