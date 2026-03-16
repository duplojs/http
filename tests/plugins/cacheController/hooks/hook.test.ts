import { PredictedResponse } from "@core";
import { createCacheControllerHook } from "@plugin-cacheController/hooks";

describe("createCacheControllerHook", () => {
	const hook = createCacheControllerHook({
		maxAge: 120.9,
		sMaxAge: 30,
		public: true,
		noStore: true,
		mustRevalidate: true,
		staleWhileRevalidate: 15.8,
	});

	it("add header on success response", () => {
		const response = new PredictedResponse("204", "test", undefined);

		hook.beforeSendResponse(
			{
				currentResponse: response,
				next: () => null as never,
				exit: () => null as never,
			} as never,
		);

		expect(response.headers!["cache-control"])
			.toStrictEqual(
				"max-age=120,s-maxage=30,public,no-store,must-revalidate,stale-while-revalidate=15",
			);
	});

	it("add header on redirection response", () => {
		const response = new PredictedResponse("300", "test", undefined);

		hook.beforeSendResponse(
			{
				currentResponse: response,
				next: () => null as never,
				exit: () => null as never,
			} as never,
		);

		expect(response.headers!["cache-control"])
			.toStrictEqual(
				"max-age=120,s-maxage=30,public,no-store,must-revalidate,stale-while-revalidate=15",
			);
	});

	it("don't add header on client error response", () => {
		const response = new PredictedResponse("400", "test", undefined);

		hook.beforeSendResponse(
			{
				currentResponse: response,
				next: () => null as never,
				exit: () => null as never,
			} as never,
		);

		expect(response.headers?.["cache-control"])
			.toStrictEqual(
				undefined,
			);
	});
});
