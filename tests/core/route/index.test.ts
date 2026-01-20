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
			}),
		).toStrictEqual({
			definition: {
				paths: ["/test"],
				method: "GET",
				preflightSteps: [],
				steps: [],
				hooks: [],
				metadata: [],
			},
			[routeKind.runTimeKey]: null,
		});
	});
});
