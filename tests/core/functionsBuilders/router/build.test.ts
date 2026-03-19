import { buildRouterFunction, type BuildRouterFunctionParams, Request } from "@core";
import { O } from "@duplojs/utils";

describe("buildRouterFunction", () => {
	it("correct call function", async() => {
		const params: BuildRouterFunctionParams = {
			routerFunctionBuilder: vi.fn(() => Promise.resolve(true) as never),
			classRequest: Request,
			environment: "DEV",
			malformedUrlRouterElement: {} as never,
			notfoundRouterElement: {} as never,
			routerElementWrapper: {},
		};

		const result = await buildRouterFunction(params);

		expect(result).toBe(true);

		expect(params.routerFunctionBuilder).toHaveBeenCalledWith(
			O.omit(params, ["routerFunctionBuilder"]),
		);
	});
});
