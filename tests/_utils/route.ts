import { createRoute } from "@core";

export const testRoute = createRoute({
	hooks: [],
	method: "GET",
	paths: ["/test"],
	preFlightSteps: [],
	steps: [],
});
