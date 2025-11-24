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
			}),
		).toStrictEqual({
			definition: {
				paths: ["/test"],
				method: "GET",
				preflightSteps: [],
				steps: [],
				hooks: [],
			},
			[routeKind.runTimeKey]: null,
		});
	});
});
