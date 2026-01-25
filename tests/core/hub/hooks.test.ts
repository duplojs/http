import { createCoreLibKind, createHookHubLifeCycle, createHub, launchHookBeforeBuildRoute, launchHookServer, launchHookServerError, serverErrorExitHookFunction, serverErrorNextHookFunction } from "@core";
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
		const fakeHook2 = vi.fn().mockResolvedValue(createCoreLibKind("server-hook-next").setTo({}));

		await launchHookServer(
			[fakeHook, fakeHook2],
			hub,
			{},
		);

		expect(fakeHook).toBeCalledWith(hub, {});
		expect(fakeHook2).toBeCalledWith(hub, {});
	});

	it("launchHookServerError continues while next is returned", async() => {
		const firstHook = vi.fn().mockResolvedValue(serverErrorNextHookFunction());
		const secondHook = vi.fn().mockResolvedValue(serverErrorExitHookFunction());

		await launchHookServerError(
			[
				firstHook,
				secondHook,
			],
			{
				error: new Error("test"),
				next: serverErrorNextHookFunction,
				exit: serverErrorExitHookFunction,
				routerInitializationData: {
					method: "",
					headers: {},
					host: "",
					origin: "",
					url: "",
				},
			},
		);

		expect(firstHook).toHaveBeenCalled();
		expect(secondHook).toHaveBeenCalled();
	});

	it("launchHookServerError stops when exit is returned", async() => {
		const firstHook = vi.fn().mockResolvedValue(serverErrorExitHookFunction());
		const secondHook = vi.fn();

		await launchHookServerError(
			[
				firstHook,
				secondHook,
			],
			{
				error: new Error("test"),
				next: serverErrorNextHookFunction,
				exit: serverErrorExitHookFunction,
				routerInitializationData: {
					method: "",
					headers: {},
					host: "",
					origin: "",
					url: "",
				},
			},
		);

		expect(firstHook).toHaveBeenCalled();
		expect(secondHook).not.toHaveBeenCalled();
	});

	it("createHookHubLifeCycle returns provided hooks", () => {
		const hook = {
			beforeStartServer: vi.fn(),
			serverError: vi.fn(),
		};

		const result = createHookHubLifeCycle(hook);

		expect(result).toBe(hook);
	});
});
