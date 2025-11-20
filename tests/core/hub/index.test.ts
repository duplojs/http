import { createHub, defaultCheckerStepFunctionBuilder, defaultExtractContract, defaultNotfoundHandler, defaultRouteFunctionBuilder, hubKind, Request, ResponseContract } from "@core";
import { type HookHubLifeCycle } from "@core/hub";
import { type HookRouteLifeCycle } from "@core/route";
import { type ExpectType } from "@duplojs/utils";
import { testRoute } from "@test-utils/route";

describe("hub", () => {
	const hub = createHub({
		environment: "DEV",
	});

	it("hub shape", () => {
		expect(hub).toStrictEqual({
			[hubKind.runTimeKey]: null,
			addHubHooks: expect.any(Function),
			addRouteFunctionBuilder: expect.any(Function),
			addRouteHooks: expect.any(Function),
			addStepFunctionBuilder: expect.any(Function),
			aggregates: expect.any(Function),
			classRequest: Request,
			config: {
				environment: "DEV",
				fromHookHeaderKey: "from-hook",
				informationHeaderKey: "information",
			},
			defaultExtractContract,
			hooksHubLifeCycle: [],
			hooksRouteLifeCycle: [],
			notfoundHandler: defaultNotfoundHandler,
			plug: expect.any(Function),
			plugins: [],
			register: expect.any(Function),
			routeFunctionBuilders: [],
			routes: [],
			setDefaultExtractContract: expect.any(Function),
			setNotfoundHandler: expect.any(Function),
			stepFunctionBuilders: [],
		});
	});

	it("hub register", () => {
		const newHub = hub.register(testRoute);

		expect(newHub).toStrictEqual({
			[hubKind.runTimeKey]: null,
			addHubHooks: expect.any(Function),
			addRouteFunctionBuilder: expect.any(Function),
			addRouteHooks: expect.any(Function),
			addStepFunctionBuilder: expect.any(Function),
			aggregates: expect.any(Function),
			classRequest: Request,
			config: {
				environment: "DEV",
				fromHookHeaderKey: "from-hook",
				informationHeaderKey: "information",
			},
			defaultExtractContract,
			hooksHubLifeCycle: [],
			hooksRouteLifeCycle: [],
			notfoundHandler: defaultNotfoundHandler,
			plug: expect.any(Function),
			plugins: [],
			register: expect.any(Function),
			routeFunctionBuilders: [],
			routes: [testRoute],
			setDefaultExtractContract: expect.any(Function),
			setNotfoundHandler: expect.any(Function),
			stepFunctionBuilders: [],
		});

		type Check = ExpectType<
			typeof newHub,
			typeof hub,
			"strict"
		>;

		expect(hub.register([testRoute])).toStrictEqual({
			[hubKind.runTimeKey]: null,
			addHubHooks: expect.any(Function),
			addRouteFunctionBuilder: expect.any(Function),
			addRouteHooks: expect.any(Function),
			addStepFunctionBuilder: expect.any(Function),
			aggregates: expect.any(Function),
			classRequest: Request,
			config: {
				environment: "DEV",
				fromHookHeaderKey: "from-hook",
				informationHeaderKey: "information",
			},
			defaultExtractContract,
			hooksHubLifeCycle: [],
			hooksRouteLifeCycle: [],
			notfoundHandler: defaultNotfoundHandler,
			plug: expect.any(Function),
			plugins: [],
			register: expect.any(Function),
			routeFunctionBuilders: [],
			routes: [testRoute],
			setDefaultExtractContract: expect.any(Function),
			setNotfoundHandler: expect.any(Function),
			stepFunctionBuilders: [],
		});

		expect(hub.register({ testRoute })).toStrictEqual({
			[hubKind.runTimeKey]: null,
			addHubHooks: expect.any(Function),
			addRouteFunctionBuilder: expect.any(Function),
			addRouteHooks: expect.any(Function),
			addStepFunctionBuilder: expect.any(Function),
			aggregates: expect.any(Function),
			classRequest: Request,
			config: {
				environment: "DEV",
				fromHookHeaderKey: "from-hook",
				informationHeaderKey: "information",
			},
			defaultExtractContract,
			hooksHubLifeCycle: [],
			hooksRouteLifeCycle: [],
			notfoundHandler: defaultNotfoundHandler,
			plug: expect.any(Function),
			plugins: [],
			register: expect.any(Function),
			routeFunctionBuilders: [],
			routes: [testRoute],
			setDefaultExtractContract: expect.any(Function),
			setNotfoundHandler: expect.any(Function),
			stepFunctionBuilders: [],
		});
	});

	it("hub plug", () => {
		const newHub = hub.plug({ name: "test" });

		expect(newHub).toStrictEqual({
			[hubKind.runTimeKey]: null,
			addHubHooks: expect.any(Function),
			addRouteFunctionBuilder: expect.any(Function),
			addRouteHooks: expect.any(Function),
			addStepFunctionBuilder: expect.any(Function),
			aggregates: expect.any(Function),
			classRequest: Request,
			config: {
				environment: "DEV",
				fromHookHeaderKey: "from-hook",
				informationHeaderKey: "information",
			},
			defaultExtractContract,
			hooksHubLifeCycle: [],
			hooksRouteLifeCycle: [],
			notfoundHandler: defaultNotfoundHandler,
			plug: expect.any(Function),
			plugins: [{ name: "test" }],
			register: expect.any(Function),
			routeFunctionBuilders: [],
			routes: [],
			setDefaultExtractContract: expect.any(Function),
			setNotfoundHandler: expect.any(Function),
			stepFunctionBuilders: [],
		});

		type Check = ExpectType<
			typeof newHub,
			typeof hub,
			"strict"
		>;

		const newHub1 = hub.plug((hub) => ({
			name: "test",
			hub,
		}));

		expect(newHub1).toStrictEqual({
			[hubKind.runTimeKey]: null,
			addHubHooks: expect.any(Function),
			addRouteFunctionBuilder: expect.any(Function),
			addRouteHooks: expect.any(Function),
			addStepFunctionBuilder: expect.any(Function),
			aggregates: expect.any(Function),
			classRequest: Request,
			config: {
				environment: "DEV",
				fromHookHeaderKey: "from-hook",
				informationHeaderKey: "information",
			},
			defaultExtractContract,
			hooksHubLifeCycle: [],
			hooksRouteLifeCycle: [],
			notfoundHandler: defaultNotfoundHandler,
			plug: expect.any(Function),
			plugins: [
				{
					name: "test",
					hub,
				},
			],
			register: expect.any(Function),
			routeFunctionBuilders: [],
			routes: [],
			setDefaultExtractContract: expect.any(Function),
			setNotfoundHandler: expect.any(Function),
			stepFunctionBuilders: [],
		});
	});

	it("hub add route function builder", () => {
		const newHub = hub.addRouteFunctionBuilder(defaultRouteFunctionBuilder);

		expect(newHub).toStrictEqual({
			[hubKind.runTimeKey]: null,
			addHubHooks: expect.any(Function),
			addRouteFunctionBuilder: expect.any(Function),
			addRouteHooks: expect.any(Function),
			addStepFunctionBuilder: expect.any(Function),
			aggregates: expect.any(Function),
			classRequest: Request,
			config: {
				environment: "DEV",
				fromHookHeaderKey: "from-hook",
				informationHeaderKey: "information",
			},
			defaultExtractContract,
			hooksHubLifeCycle: [],
			hooksRouteLifeCycle: [],
			notfoundHandler: defaultNotfoundHandler,
			plug: expect.any(Function),
			plugins: [],
			register: expect.any(Function),
			routeFunctionBuilders: [defaultRouteFunctionBuilder],
			routes: [],
			setDefaultExtractContract: expect.any(Function),
			setNotfoundHandler: expect.any(Function),
			stepFunctionBuilders: [],
		});

		type Check = ExpectType<
			typeof newHub,
			typeof hub,
			"strict"
		>;
	});

	it("hub add step function builder", () => {
		const newHub = hub.addStepFunctionBuilder(defaultCheckerStepFunctionBuilder);

		expect(newHub).toStrictEqual({
			[hubKind.runTimeKey]: null,
			addHubHooks: expect.any(Function),
			addRouteFunctionBuilder: expect.any(Function),
			addRouteHooks: expect.any(Function),
			addStepFunctionBuilder: expect.any(Function),
			aggregates: expect.any(Function),
			classRequest: Request,
			config: {
				environment: "DEV",
				fromHookHeaderKey: "from-hook",
				informationHeaderKey: "information",
			},
			defaultExtractContract,
			hooksHubLifeCycle: [],
			hooksRouteLifeCycle: [],
			notfoundHandler: defaultNotfoundHandler,
			plug: expect.any(Function),
			plugins: [],
			register: expect.any(Function),
			routeFunctionBuilders: [],
			routes: [],
			setDefaultExtractContract: expect.any(Function),
			setNotfoundHandler: expect.any(Function),
			stepFunctionBuilders: [defaultCheckerStepFunctionBuilder],
		});

		type Check = ExpectType<
			typeof newHub,
			typeof hub,
			"strict"
		>;
	});

	it("hub add route hooks", () => {
		const routeHook: HookRouteLifeCycle = {};
		const newHub = hub.addRouteHooks(routeHook);

		expect(newHub).toStrictEqual({
			[hubKind.runTimeKey]: null,
			addHubHooks: expect.any(Function),
			addRouteFunctionBuilder: expect.any(Function),
			addRouteHooks: expect.any(Function),
			addStepFunctionBuilder: expect.any(Function),
			aggregates: expect.any(Function),
			classRequest: Request,
			config: {
				environment: "DEV",
				fromHookHeaderKey: "from-hook",
				informationHeaderKey: "information",
			},
			defaultExtractContract,
			hooksHubLifeCycle: [],
			hooksRouteLifeCycle: [routeHook],
			notfoundHandler: defaultNotfoundHandler,
			plug: expect.any(Function),
			plugins: [],
			register: expect.any(Function),
			routeFunctionBuilders: [],
			routes: [],
			setDefaultExtractContract: expect.any(Function),
			setNotfoundHandler: expect.any(Function),
			stepFunctionBuilders: [],
		});

		type Check = ExpectType<
			typeof newHub,
			typeof hub,
			"strict"
		>;
	});

	it("hub add hub hooks", () => {
		const hubHook: HookHubLifeCycle = {};
		const newHub = hub.addHubHooks(hubHook);

		expect(newHub).toStrictEqual({
			[hubKind.runTimeKey]: null,
			addHubHooks: expect.any(Function),
			addRouteFunctionBuilder: expect.any(Function),
			addRouteHooks: expect.any(Function),
			addStepFunctionBuilder: expect.any(Function),
			aggregates: expect.any(Function),
			classRequest: Request,
			config: {
				environment: "DEV",
				fromHookHeaderKey: "from-hook",
				informationHeaderKey: "information",
			},
			defaultExtractContract,
			hooksHubLifeCycle: [hubHook],
			hooksRouteLifeCycle: [],
			notfoundHandler: defaultNotfoundHandler,
			plug: expect.any(Function),
			plugins: [],
			register: expect.any(Function),
			routeFunctionBuilders: [],
			routes: [],
			setDefaultExtractContract: expect.any(Function),
			setNotfoundHandler: expect.any(Function),
			stepFunctionBuilders: [],
		});

		type Check = ExpectType<
			typeof newHub,
			typeof hub,
			"strict"
		>;
	});

	it("hub aggregates combine plugins", () => {
		const routeHook: HookRouteLifeCycle = {};
		const hubHook: HookHubLifeCycle = {};

		const aggregated = hub
			.addRouteHooks(routeHook)
			.addHubHooks(hubHook)
			.addRouteFunctionBuilder(defaultRouteFunctionBuilder)
			.addStepFunctionBuilder(defaultCheckerStepFunctionBuilder)
			.register(testRoute)
			.plug({
				name: "test",
				hooksRouteLifeCycle: [routeHook],
				hooksHubLifeCycle: [hubHook],
				routes: [testRoute],
				routeFunctionBuilders: [defaultRouteFunctionBuilder],
				stepFunctionBuilders: [defaultCheckerStepFunctionBuilder],
			})
			.aggregates();

		expect(aggregated).toStrictEqual({
			hooksRouteLifeCycle: [routeHook, routeHook],
			hooksHubLifeCycle: [hubHook, hubHook],
			routes: [testRoute, testRoute],
			routeFunctionBuilders: [
				defaultRouteFunctionBuilder,
				defaultRouteFunctionBuilder,
			],
			stepFunctionBuilders: [
				defaultCheckerStepFunctionBuilder,
				defaultCheckerStepFunctionBuilder,
			],
		});
	});

	it("hub set not found handler", () => {
		const contract = ResponseContract.notFound("test");

		const newHub = hub.setNotfoundHandler(
			contract,
			({ response }) => response("test"),
		);

		expect(newHub).toStrictEqual({
			[hubKind.runTimeKey]: null,
			addHubHooks: expect.any(Function),
			addRouteFunctionBuilder: expect.any(Function),
			addRouteHooks: expect.any(Function),
			addStepFunctionBuilder: expect.any(Function),
			aggregates: expect.any(Function),
			classRequest: Request,
			config: {
				environment: "DEV",
				fromHookHeaderKey: "from-hook",
				informationHeaderKey: "information",
			},
			defaultExtractContract,
			hooksHubLifeCycle: [],
			hooksRouteLifeCycle: [],
			notfoundHandler: expect.objectContaining({
				definition: expect.objectContaining({
					responseContract: contract,
				}),
			}),
			plug: expect.any(Function),
			plugins: [],
			register: expect.any(Function),
			routeFunctionBuilders: [],
			routes: [],
			setDefaultExtractContract: expect.any(Function),
			setNotfoundHandler: expect.any(Function),
			stepFunctionBuilders: [],
		});
	});

	it("hub set default extract contract", () => {
		const contract = ResponseContract.notFound("test");

		const newHub = hub.setDefaultExtractContract(contract);

		expect(newHub).toStrictEqual({
			[hubKind.runTimeKey]: null,
			addHubHooks: expect.any(Function),
			addRouteFunctionBuilder: expect.any(Function),
			addRouteHooks: expect.any(Function),
			addStepFunctionBuilder: expect.any(Function),
			aggregates: expect.any(Function),
			classRequest: Request,
			config: {
				environment: "DEV",
				fromHookHeaderKey: "from-hook",
				informationHeaderKey: "information",
			},
			defaultExtractContract: contract,
			hooksHubLifeCycle: [],
			hooksRouteLifeCycle: [],
			notfoundHandler: defaultNotfoundHandler,
			plug: expect.any(Function),
			plugins: [],
			register: expect.any(Function),
			routeFunctionBuilders: [],
			routes: [],
			setDefaultExtractContract: expect.any(Function),
			setNotfoundHandler: expect.any(Function),
			stepFunctionBuilders: [],
		});
	});
});
