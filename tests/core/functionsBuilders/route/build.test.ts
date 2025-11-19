import { buildRouteFunction, buildStepFunction, createExtractStep, createRouteFunctionBuilder, createStepFunctionBuilder } from "@core";
import { E } from "@duplojs/utils";
import { testRoute } from "@test-utils/route";

describe("buildStepFunction", () => {
	const spySupport = vi.fn(() => true);
	const spyBuild = vi.fn(async(step, { success, buildStep }) => {
		const result = await buildStep(step);
		if (E.isRight(result)) {
			return result;
		}
		return success({
			buildedFunction: () => ({}),
			hooksRouteLifeCycle: [],
		});
	});
	const routeFunctionBuilders = createRouteFunctionBuilder(
		spySupport as never,
		spyBuild,
	);

	beforeEach(() => {
		spySupport.mockClear();
		spyBuild.mockClear();
	});

	it("build step", async() => {
		spySupport
			.mockImplementationOnce(() => true)
			.mockImplementationOnce(() => false);

		const result = await buildRouteFunction(
			testRoute,
			{
				environment: "DEV",
				stepFunctionBuilders: [],
				routeFunctionBuilders: [routeFunctionBuilders],
				globalHooksRouteLifeCycle: [],
			},
		);

		expect(E.isRight(result)).toBe(true);
		expect(spyBuild).toHaveBeenCalledOnce();
	});

	it("not build step", async() => {
		spySupport.mockImplementation(() => false);

		const result = await buildRouteFunction(
			testRoute,
			{
				environment: "DEV",
				stepFunctionBuilders: [],
				routeFunctionBuilders: [routeFunctionBuilders],
				globalHooksRouteLifeCycle: [],
			},
		);

		expect(E.isRight(result)).toBe(false);
		expect(spyBuild).not.toHaveBeenCalledOnce();
	});
});
