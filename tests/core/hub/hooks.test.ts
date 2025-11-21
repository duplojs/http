import { createHub, launchHookBeforeBuildRoute, launchHookServer } from "@core";
import { testRoute } from "@test-utils/route";

describe("hub hooks", () => {
	it("launchHookBeforeBuildRoute", async() => {
		const result = await launchHookBeforeBuildRoute(
			[
				(route) => ({
					...route,
					paths: ["/toto"],
				}),
			],
			testRoute,
		);

		expect(result).toStrictEqual({
			...testRoute,
			paths: ["/toto"],
		});
	});

	it("launchHookServer", async() => {
		const hub = createHub({ environment: "DEV" });
		const fakeHook = vi.fn();

		await launchHookServer(
			[fakeHook],
			hub,
			{},
		);

		expect(fakeHook).toBeCalledWith(hub, {});
	});
});
