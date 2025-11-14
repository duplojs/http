import { createFunctionBuilder, type Route, routeKind } from "@core";
import { E, type ExpectType } from "@duplojs/utils";
import { testProcess } from "@test-utils/process";
import { testRoute } from "@test-utils/route";

describe("createFunctionBuilder", () => {
	const fakeFnc = vi.fn();
	const functionBuilder = createFunctionBuilder(
		(element, { support, notSupport }) => routeKind.has(element)
			? support(element)
			: notSupport(),
		(route, { success }) => {
			type Check = ExpectType<
				typeof route,
				Route,
				"strict"
			>;
			fakeFnc(route);

			return success(async(request) => {});
		},
	);

	beforeEach(() => {
		fakeFnc.mockClear();
	});

	it("support element", async() => {
		const result = await functionBuilder(
			testRoute,
			{
				success: (element) => E.right("successBuild", element),
				buildElement: () => void undefined as never,
				environment: "DEV",
				globalHooksRouteLifeCycle: [],
			},
		);

		expect(E.isRight(result)).toBe(true);
		expect(fakeFnc).toHaveBeenCalledOnce();
	});

	it("not support element", async() => {
		const result = await functionBuilder(
			testProcess,
			{
				success: (element) => E.right("successBuild", element),
				buildElement: () => void undefined as never,
				environment: "DEV",
				globalHooksRouteLifeCycle: [],
			},
		);

		expect(E.hasInformation(result, "notSupport")).toBe(true);
		expect(fakeFnc).not.toBeCalled();
	});
});
