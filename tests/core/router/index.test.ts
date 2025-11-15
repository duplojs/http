import { buildRouter, createHub } from "@core";
import { testRoute } from "@test-utils/route";

describe("buildRouter", () => {
	it("correct build router", async() => {
		const router = await buildRouter(
			createHub({
				environment: "DEV",
			})
				.addHooks({
					hooksHubLifeCycle: [{}],
					hooksRouteLifeCycle: [{}],
				})
				.addFunctionBuilder({
					routeFunctionBuilders: [],
					stepFunctionBuilders: [],
					processFunctionBuilders: [],
				})
				.register([testRoute]),
		);
	});
});
