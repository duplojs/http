import { type createFunctionBuilder, createHub, type HookHubLifeCycle, type HookRouteLifeCycle, type Hub, hubKind, type Process, Request, type Route, type Steps } from "@core";
import { type ExpectType } from "@duplojs/utils";
import { testRoute } from "@test-utils/route";

describe("hub", () => {
	const hub = createHub({
		environment: "DEV",
	});

	it("hub shape", () => {
		expect(hub).toStrictEqual({
			[hubKind.runTimeKey]: null,
			addFunctionBuilder: expect.any(Function),
			addHooks: expect.any(Function),
			plug: expect.any(Function),
			register: expect.any(Function),
			classRequest: Request,
			definitions: [{ environment: "DEV" }],
		});
	});

	it("hub register", () => {
		const newHub = hub.register(testRoute);

		expect(newHub).toStrictEqual({
			[hubKind.runTimeKey]: null,
			addFunctionBuilder: expect.any(Function),
			addHooks: expect.any(Function),
			plug: expect.any(Function),
			register: expect.any(Function),
			classRequest: Request,
			definitions: [
				{ environment: "DEV" },
				{ routes: [testRoute] },
			],
		});

		type Check = ExpectType<
			typeof newHub,
			Hub<
				readonly [
					{
						readonly environment: "DEV";
					},
					{
						readonly routes: Route[];
					},
				]
			>,
			"strict"
		>;

		expect(hub.register([testRoute])).toStrictEqual({
			[hubKind.runTimeKey]: null,
			addFunctionBuilder: expect.any(Function),
			addHooks: expect.any(Function),
			plug: expect.any(Function),
			register: expect.any(Function),
			classRequest: Request,
			definitions: [
				{ environment: "DEV" },
				{ routes: [testRoute] },
			],
		});

		expect(hub.register({ testRoute })).toStrictEqual({
			[hubKind.runTimeKey]: null,
			addFunctionBuilder: expect.any(Function),
			addHooks: expect.any(Function),
			plug: expect.any(Function),
			register: expect.any(Function),
			classRequest: Request,
			definitions: [
				{ environment: "DEV" },
				{ routes: [testRoute] },
			],
		});
	});

	it("hub plug", () => {
		const newHub = hub.plug({ name: "test" });

		expect(newHub).toStrictEqual({
			[hubKind.runTimeKey]: null,
			addFunctionBuilder: expect.any(Function),
			addHooks: expect.any(Function),
			plug: expect.any(Function),
			register: expect.any(Function),
			classRequest: Request,
			definitions: [
				{ environment: "DEV" },
				{ name: "test" },
			],
		});

		type Check = ExpectType<
			typeof newHub,
			Hub<
				readonly [
					{
						readonly environment: "DEV";
					},
					{
						readonly name: "test";
					},
				]
			>,
			"strict"
		>;

		const newHub1 = hub.plug((hub) => ({
			name: "test",
			hub,
		}));

		expect(newHub1).toStrictEqual({
			[hubKind.runTimeKey]: null,
			addFunctionBuilder: expect.any(Function),
			addHooks: expect.any(Function),
			plug: expect.any(Function),
			register: expect.any(Function),
			classRequest: Request,
			definitions: [
				{ environment: "DEV" },
				{
					name: "test",
					hub,
				},
			],
		});

		type Check1 = ExpectType<
			typeof newHub1,
			Hub<
				readonly [
					{
						readonly environment: "DEV";
					},
					{
						readonly name: "test";
						readonly hub: typeof hub;
					},
				]
			>,
			"strict"
		>;
	});

	it("hub addFunctionBuilder", () => {
		const newHub = hub.addFunctionBuilder({ processFunctionBuilders: [] });

		expect(newHub).toStrictEqual({
			[hubKind.runTimeKey]: null,
			addFunctionBuilder: expect.any(Function),
			addHooks: expect.any(Function),
			plug: expect.any(Function),
			register: expect.any(Function),
			classRequest: Request,
			definitions: [
				{ environment: "DEV" },
				{ processFunctionBuilders: [] },
			],
		});

		type Check = ExpectType<
			typeof newHub,
			Hub<
				readonly [
					{
						readonly environment: "DEV";
					},
					{
						readonly routeFunctionBuilders?: readonly ReturnType<typeof createFunctionBuilder<Route>>[];
						readonly processFunctionBuilders?: readonly ReturnType<typeof createFunctionBuilder<Process>>[];
						readonly stepFunctionBuilders?: readonly ReturnType<typeof createFunctionBuilder<Steps>>[];
					},
				]
			>,
			"strict"
		>;
	});

	it("hub addHooks", () => {
		const newHub = hub.addHooks({ hooksRouteLifeCycle: [] });

		expect(newHub).toStrictEqual({
			[hubKind.runTimeKey]: null,
			addFunctionBuilder: expect.any(Function),
			addHooks: expect.any(Function),
			plug: expect.any(Function),
			register: expect.any(Function),
			classRequest: Request,
			definitions: [
				{ environment: "DEV" },
				{ hooksRouteLifeCycle: [] },
			],
		});

		type Check = ExpectType<
			typeof newHub,
			Hub<
				readonly [
					{
						readonly environment: "DEV";
					},
					{
						readonly hooksRouteLifeCycle?: readonly HookRouteLifeCycle[];
						readonly hooksHubLifeCycle?: readonly HookHubLifeCycle[];
					},
				]
			>,
			"strict"
		>;
	});
});
