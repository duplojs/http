import { type HookRouteLifeCycle, defaultBodyController, createHub, defaultCheckerStepFunctionBuilder, defaultExtractContract, defaultNotfoundHandler, defaultRouteFunctionBuilder, hubKind, Request, ResponseContract, type HookHubLifeCycle } from "@core";
import { testRoute } from "@test-utils/route";

describe("hub", () => {
	const baseHub = {
		[hubKind.runTimeKey]: null,
		classRequest: Request,
		config: { environment: "DEV" },
		defaultExtractContract,
		hooksHubLifeCycle: [],
		hooksRouteLifeCycle: [],
		notfoundHandler: defaultNotfoundHandler,
		defaultBodyController: defaultBodyController,
		plugins: [],
		routeFunctionBuilders: [],
		routes: new Set(),
		stepFunctionBuilders: [],
		bodyReaderImplementations: [],
	};

	it.only("hub shape", () => {
		const hub = createHub({
			environment: "DEV",
		});

		expect({ ...hub }).toStrictEqual(baseHub);
	});

	it("hub register", () => {
		const hub = createHub({
			environment: "DEV",
		})
			.register(testRoute);

		expect({ ...hub }).toStrictEqual({
			...baseHub,
			routes: new Set([testRoute]),
		});

		const otherRoute = { ...testRoute };
		hub.register([otherRoute]);

		expect({ ...hub }).toStrictEqual({
			...baseHub,
			routes: new Set([testRoute, otherRoute]),
		});

		const otherOtherRoute = { ...testRoute };
		hub.register([otherOtherRoute]);

		expect(hub.register({ otherOtherRoute })).toStrictEqual({
			...baseHub,
			routes: new Set([testRoute, otherRoute, otherOtherRoute]),
		});
	});

	it("hub plug", () => {
		const hub = createHub({
			environment: "DEV",
		})
			.plug({ name: "test" });

		expect({ ...hub }).toStrictEqual({
			...baseHub,
			plugins: [{ name: "test" }],
		});

		hub.plug((hub) => ({
			name: "test",
			hub,
		}));

		expect({ ...hub }).toStrictEqual({
			...baseHub,
			plugins: [
				{ name: "test" },
				{
					name: "test",
					hub,
				},
			],
		});
	});

	it("hub add route function builder", () => {
		const hub = createHub({
			environment: "DEV",
		})
			.addRouteFunctionBuilder(defaultRouteFunctionBuilder);

		expect({ ...hub }).toStrictEqual({
			...baseHub,
			routeFunctionBuilders: [defaultRouteFunctionBuilder],
		});
	});

	it("hub add step function builder", () => {
		const hub = createHub({
			environment: "DEV",
		})
			.addStepFunctionBuilder(defaultCheckerStepFunctionBuilder);

		expect({ ...hub }).toStrictEqual({
			...baseHub,
			stepFunctionBuilders: [defaultCheckerStepFunctionBuilder],
		});
	});

	it("hub add route hooks", () => {
		const routeHook: HookRouteLifeCycle = {};
		const hub = createHub({
			environment: "DEV",
		})
			.addRouteHooks(routeHook);

		expect({ ...hub }).toStrictEqual({
			...baseHub,
			hooksRouteLifeCycle: [routeHook],
		});
	});

	it("hub add hub hooks", () => {
		const hubHook: HookHubLifeCycle = {};
		const hub = createHub({
			environment: "DEV",
		})
			.addHubHooks(hubHook);

		expect({ ...hub }).toStrictEqual({
			...baseHub,
			hooksHubLifeCycle: [hubHook],
		});
	});

	it("hub aggregates combine plugins", () => {
		const routeHook: HookRouteLifeCycle = {
			beforeRouteExecution: () => undefined as any,
		};
		const hubHook: HookHubLifeCycle = {
			beforeStartServer: (hub) => hub,
		};

		const aggregatedHub = createHub({
			environment: "DEV",
		})
			.addRouteHooks([routeHook, {}])
			.addHubHooks([hubHook, {}])
			.addRouteFunctionBuilder(defaultRouteFunctionBuilder)
			.addStepFunctionBuilder(defaultCheckerStepFunctionBuilder)
			.register(testRoute)
			.plug({
				name: "test",
				hooksRouteLifeCycle: [routeHook, {}],
				hooksHubLifeCycle: [hubHook, {}],
				routes: [testRoute],
				routeFunctionBuilders: [defaultRouteFunctionBuilder],
				stepFunctionBuilders: [defaultCheckerStepFunctionBuilder],
			})
			.plug({ name: "empty" });

		expect(aggregatedHub.aggregatesHooksHubLifeCycle("beforeStartServer")).toStrictEqual([
			hubHook.beforeStartServer,
			hubHook.beforeStartServer,
		]);
		expect(aggregatedHub.aggregatesHooksRouteLifeCycle("beforeRouteExecution")).toStrictEqual([
			routeHook.beforeRouteExecution,
			routeHook.beforeRouteExecution,
		]);
	});

	it("hub set not found handler", () => {
		const contract = ResponseContract.notFound("test");

		const newHub = createHub({
			environment: "DEV",
		})
			.setNotfoundHandler(
				contract,
				({ response }) => response("test"),
			);

		expect(newHub).toStrictEqual({
			...baseHub,
			notfoundHandler: expect.objectContaining({
				definition: expect.objectContaining({
					responseContract: contract,
				}),
			}),
		});
	});

	it("hub set default extract contract", () => {
		const contract = ResponseContract.notFound("test");

		const newHub = createHub({
			environment: "DEV",
		})
			.setDefaultExtractContract(contract);

		expect(newHub).toStrictEqual({
			...baseHub,
			defaultExtractContract: contract,
		});
	});
});
