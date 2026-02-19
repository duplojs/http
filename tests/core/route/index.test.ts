import { createRoute, routeKind } from "@core";

describe("route", () => {
	it("createRoute", () => {
		expect(
			createRoute({
				paths: ["/test"],
				method: "GET",
				preflightSteps: [],
				steps: [],
				hooks: [],
				metadata: [],
				bodyController: null,
			}),
		).toStrictEqual({
			definition: {
				paths: ["/test"],
				method: "GET",
				preflightSteps: [],
				steps: [],
				hooks: [],
				metadata: [],
				bodyController: null,
			},
			[routeKind.runTimeKey]: null,
		});
	});
});
