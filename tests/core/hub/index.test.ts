import { createHub, defaultCheckerStepFunctionBuilder, defaultExtractContract, defaultNotfoundHandler, defaultRouteFunctionBuilder, hubKind, Request, ResponseContract } from "@core";
import { type HookHubLifeCycle } from "@core/hub";
import { type HookRouteLifeCycle } from "@core/route";
import { type ExpectType } from "@duplojs/utils";
import { testRoute } from "@test-utils/route";

describe("hub", () => {
	const hub = createHub({
		environment: "DEV",
	});

	const baseHub = {
		[hubKind.runTimeKey]: null,
		addHubHooks: expect.any(Function),
		addRouteFunctionBuilder: expect.any(Function),
		addRouteHooks: expect.any(Function),
		addStepFunctionBuilder: expect.any(Function),
		aggregates: expect.any(Function),
		aggregatesHooksHubLifeCycle: expect.any(Function),
		aggregatesHooksRouteLifeCycle: expect.any(Function),
		aggregatesRouteFunctionBuilders: expect.any(Function),
		aggregatesRoutes: expect.any(Function),
		aggregatesStepFunctionBuilders: expect.any(Function),
		register: expect.any(Function),
		plug: expect.any(Function),
		setDefaultExtractContract: expect.any(Function),
		setNotfoundHandler: expect.any(Function),
		classRequest: Request,
		config: { environment: "DEV" },
		defaultExtractContract,
		hooksHubLifeCycle: [],
		hooksRouteLifeCycle: [],
		notfoundHandler: defaultNotfoundHandler,
		plugins: [],
		routeFunctionBuilders: [],
		routes: [],
		stepFunctionBuilders: [],
	};

	it("hub shape", () => {
		expect(hub).toStrictEqual(baseHub);
	});

	it("hub register", () => {
		const newHub = hub.register(testRoute);

		expect(newHub).toStrictEqual({
			...baseHub,
			routes: [testRoute],
		});

		expect(hub.register([testRoute])).toStrictEqual({
			...baseHub,
			routes: [testRoute],
		});

		expect(hub.register({ testRoute })).toStrictEqual({
			...baseHub,
			routes: [testRoute],
		});
	});

	it("hub plug", () => {
		const newHub = hub.plug({ name: "test" });

		expect(newHub).toStrictEqual({
			...baseHub,
			plugins: [{ name: "test" }],
		});

		const newHub1 = hub.plug((hub) => ({
			name: "test",
			hub,
		}));

		expect(newHub1).toStrictEqual({
			...baseHub,
			plugins: [
				{
					name: "test",
					hub,
				},
			],
		});
	});

	it("hub add route function builder", () => {
		const newHub = hub.addRouteFunctionBuilder(defaultRouteFunctionBuilder);

		expect(newHub).toStrictEqual({
			...baseHub,
			routeFunctionBuilders: [defaultRouteFunctionBuilder],
		});
	});

	it("hub add step function builder", () => {
		const newHub = hub.addStepFunctionBuilder(defaultCheckerStepFunctionBuilder);

		expect(newHub).toStrictEqual({
			...baseHub,
			stepFunctionBuilders: [defaultCheckerStepFunctionBuilder],
		});
	});

	it("hub add route hooks", () => {
		const routeHook: HookRouteLifeCycle = {};
		const newHub = hub.addRouteHooks(routeHook);

		expect(newHub).toStrictEqual({
			...baseHub,
			hooksRouteLifeCycle: [routeHook],
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

		const aggregatedHub = hub
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

		expect(aggregatedHub.aggregatesRoutes()).toStrictEqual([
			testRoute,
			testRoute,
		]);
		expect(aggregatedHub.aggregatesRouteFunctionBuilders()).toStrictEqual([
			defaultRouteFunctionBuilder,
			defaultRouteFunctionBuilder,
		]);
		expect(aggregatedHub.aggregatesStepFunctionBuilders()).toStrictEqual([
			defaultCheckerStepFunctionBuilder,
			defaultCheckerStepFunctionBuilder,
		]);
		expect(aggregatedHub.aggregatesHooksHubLifeCycle("beforeStartServer")).toStrictEqual([
			hubHook.beforeStartServer,
			hubHook.beforeStartServer,
		]);
		expect(aggregatedHub.aggregatesHooksRouteLifeCycle("beforeRouteExecution")).toStrictEqual([
			routeHook.beforeRouteExecution,
			routeHook.beforeRouteExecution,
		]);
		expect(aggregatedHub.aggregates()).toStrictEqual({
			hooksRouteLifeCycle: [routeHook, {}, routeHook, {}],
			hooksHubLifeCycle: [hubHook, {}, hubHook, {}],
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

		const newHub = hub.setDefaultExtractContract(contract);

		expect(newHub).toStrictEqual({
			...baseHub,
			defaultExtractContract: contract,
		});
	});
});
