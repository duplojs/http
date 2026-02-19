import { routeStore } from "@core/builders/route/store";
import { createRoute } from "@core/route";

describe("route store", () => {
	const route1 = createRoute({
		hooks: [],
		method: "GET",
		paths: ["/users"],
		preflightSteps: [],
		steps: [],
		metadata: [],
		bodyController: null,
	});
	const route2 = createRoute({
		hooks: [],
		method: "POST",
		paths: ["/users"],
		preflightSteps: [],
		steps: [],
		metadata: [],
		bodyController: null,
	});

	it("adds routes and returns them in the store", () => {
		routeStore.add(route1);
		routeStore.add(route2);

		expect([...routeStore.getAll()]).toStrictEqual([route1, route2]);
	});

	it("stores a route only once even if added multiple times", () => {
		routeStore.add(route1);

		expect([...routeStore.getAll()]).toStrictEqual([route1, route2]);
	});
});
