import { createHub, defaultExtractContract, defaultNotfoundHandler, type Hub, type HubDefinition, hubKind, Request, ResponseContract } from "@core";
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
			setNotfoundHandler: expect.any(Function),
			classRequest: Request,
			definitions: [{ environment: "DEV" }],
			notfoundHandler: defaultNotfoundHandler,
			defaultExtractContract,
			setDefaultExtractContract: expect.any(Function),
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
			setNotfoundHandler: expect.any(Function),
			setDefaultExtractContract: expect.any(Function),
			defaultExtractContract,
			classRequest: Request,
			definitions: [
				{ environment: "DEV" },
				{ routes: [testRoute] },
			],
			notfoundHandler: defaultNotfoundHandler,
		});

		type Check = ExpectType<
			typeof newHub,
			Hub<
				readonly [
					{
						readonly environment: "DEV";
					},
					HubDefinition,
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
			setNotfoundHandler: expect.any(Function),
			setDefaultExtractContract: expect.any(Function),
			defaultExtractContract,
			classRequest: Request,
			definitions: [
				{ environment: "DEV" },
				{ routes: [testRoute] },
			],
			notfoundHandler: defaultNotfoundHandler,
		});

		expect(hub.register({ testRoute })).toStrictEqual({
			[hubKind.runTimeKey]: null,
			addFunctionBuilder: expect.any(Function),
			addHooks: expect.any(Function),
			plug: expect.any(Function),
			register: expect.any(Function),
			setNotfoundHandler: expect.any(Function),
			setDefaultExtractContract: expect.any(Function),
			defaultExtractContract,
			classRequest: Request,
			definitions: [
				{ environment: "DEV" },
				{ routes: [testRoute] },
			],
			notfoundHandler: defaultNotfoundHandler,
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
			setNotfoundHandler: expect.any(Function),
			setDefaultExtractContract: expect.any(Function),
			defaultExtractContract,
			classRequest: Request,
			definitions: [
				{ environment: "DEV" },
				{ name: "test" },
			],
			notfoundHandler: defaultNotfoundHandler,
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
			setNotfoundHandler: expect.any(Function),
			setDefaultExtractContract: expect.any(Function),
			defaultExtractContract,
			classRequest: Request,
			definitions: [
				{ environment: "DEV" },
				{
					name: "test",
					hub,
				},
			],
			notfoundHandler: defaultNotfoundHandler,
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
		const newHub = hub.addFunctionBuilder({ routeFunctionBuilders: [] });

		expect(newHub).toStrictEqual({
			[hubKind.runTimeKey]: null,
			addFunctionBuilder: expect.any(Function),
			addHooks: expect.any(Function),
			plug: expect.any(Function),
			register: expect.any(Function),
			setNotfoundHandler: expect.any(Function),
			setDefaultExtractContract: expect.any(Function),
			defaultExtractContract,
			classRequest: Request,
			definitions: [
				{ environment: "DEV" },
				{ routeFunctionBuilders: [] },
			],
			notfoundHandler: defaultNotfoundHandler,
		});

		type Check = ExpectType<
			typeof newHub,
			Hub<
				readonly [
					{
						readonly environment: "DEV";
					},
					HubDefinition,
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
			setNotfoundHandler: expect.any(Function),
			setDefaultExtractContract: expect.any(Function),
			defaultExtractContract,
			classRequest: Request,
			definitions: [
				{ environment: "DEV" },
				{ hooksRouteLifeCycle: [] },
			],
			notfoundHandler: defaultNotfoundHandler,
		});

		type Check = ExpectType<
			typeof newHub,
			Hub<
				readonly [
					{
						readonly environment: "DEV";
					},
					HubDefinition,
				]
			>,
			"strict"
		>;
	});

	it("hub set not found handler", () => {
		const contract = ResponseContract.notFound("test");

		const newHub = hub.setNotfoundHandler(
			contract,
			({ response }) => response("test"),
		);

		expect(newHub).toStrictEqual({
			[hubKind.runTimeKey]: null,
			addFunctionBuilder: expect.any(Function),
			addHooks: expect.any(Function),
			plug: expect.any(Function),
			register: expect.any(Function),
			setNotfoundHandler: expect.any(Function),
			setDefaultExtractContract: expect.any(Function),
			defaultExtractContract,
			classRequest: Request,
			definitions: [{ environment: "DEV" }],
			notfoundHandler: {
				...newHub.notfoundHandler,
				definition: {
					...newHub.notfoundHandler.definition,
					responseContract: contract,
				},
			},
		});
	});

	it("hub set default extract contract", () => {
		const contract = ResponseContract.notFound("test");

		const newHub = hub.setDefaultExtractContract(
			contract,
		);

		expect(newHub).toStrictEqual({
			[hubKind.runTimeKey]: null,
			addFunctionBuilder: expect.any(Function),
			addHooks: expect.any(Function),
			plug: expect.any(Function),
			register: expect.any(Function),
			setNotfoundHandler: expect.any(Function),
			setDefaultExtractContract: expect.any(Function),
			defaultExtractContract: contract,
			classRequest: Request,
			definitions: [{ environment: "DEV" }],
			notfoundHandler: defaultNotfoundHandler,
		});
	});
});
