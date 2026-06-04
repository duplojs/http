import { createHub, launchHookServer, ResponseContract, useRouteBuilder } from "@core";
import { DPE, E } from "@duplojs/utils";
import { TESTImplementation, setEnvironment } from "@duplojs/server-utils";
import { codeGeneratorPlugin } from "@plugin-codeGenerator";

describe("plugin implementation", () => {
	setEnvironment("TEST");
	const spy = vi.fn((path: string, content: string) => Promise.resolve(E.ok()));
	const spyExists = vi.fn((path: string) => Promise.resolve(E.left("file-system-exists")));
	const spyMakeDirectory = vi.fn((path: string) => Promise.resolve(E.ok()));
	const spyRemove = vi.fn((path: string, params?: { recursive?: boolean }) => Promise.resolve(E.ok()));
	TESTImplementation.set("writeTextFile", spy);
	TESTImplementation.set("exists", spyExists);
	TESTImplementation.set("makeDirectory", spyMakeDirectory);
	TESTImplementation.set("remove", spyRemove);

	beforeEach(() => {
		spy.mockClear();
		spyExists.mockClear();
		spyMakeDirectory.mockClear();
		spyRemove.mockClear();
	});

	const route = useRouteBuilder("GET", "/user")
		.extract({
			headers: {
				header1: DPE.date(),
				header2: DPE.time(),
			},
			body: DPE.object({
				name: DPE.string(),
				age: DPE.number(),
			}),
		})
		.cut(
			ResponseContract.conflict("the-conflict"),
			(__, { response }) => response("the-conflict"),
		)
		.handler(
			ResponseContract.ok("success", DPE.string()),
			(__, { response }) => response("success", ""),
		);

	it("generate API type", async() => {
		const hub = createHub({ environment: "DEV" })
			.plug(codeGeneratorPlugin({ outputFile: "test.d.ts" }))
			.register(route);

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeStartServer"),
			hub,
			{} as any,
		);

		expect(spy.mock.lastCall?.at(0)).toBe("test.d.ts");
		expect(spy.mock.lastCall?.at(1)).toMatchSnapshot();
	});

	it("not generate API type", async() => {
		const hub = createHub({ environment: "DEV" })
			.plug(codeGeneratorPlugin({ outputFile: "test.d.ts" }));

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeStartServer"),
			hub,
			{} as any,
		);

		expect(spy).not.toHaveBeenCalled();
	});

	it("not generate in PROD env", async() => {
		const hub = createHub({ environment: "PROD" })
			.plug(codeGeneratorPlugin({ outputFile: "test.d.ts" }))
			.register(route);

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeStartServer"),
			hub,
			{} as any,
		);

		expect(spy).not.toHaveBeenCalled();
	});

	it("generate data parser files from identified route data parsers", async() => {
		const childDataParser = DPE.string().setIdentifier("ChildParser");
		const bodyDataParser = DPE.object({
			child: childDataParser,
			count: DPE.number(),
		}).setIdentifier("BodyParser");

		const route = useRouteBuilder("GET", "/generated")
			.extract({
				body: bodyDataParser,
			})
			.handler(
				ResponseContract.ok("generated.success", childDataParser),
				(__, { response }) => response("generated.success", ""),
			);

		const hub = createHub({ environment: "DEV" })
			.plug(codeGeneratorPlugin({
				outputFile: "routes.d.ts",
				generateDataParser: {
					outputFolder: "generated",
				},
			}))
			.register(route);

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeStartServer"),
			hub,
			{} as any,
		);

		expect(spy.mock.calls).toHaveLength(5);
		expect(spy.mock.calls[0]).toMatchSnapshot();
		expect(spy.mock.calls[1]).toMatchSnapshot();
		expect(spy.mock.calls[2]).toMatchSnapshot();
		expect(spy.mock.calls[3]).toMatchSnapshot();
		expect(spy.mock.calls[4]).toMatchSnapshot();
	});

	it("generate data parser files only from explicit data parsers when disabledFromRoute is enabled", async() => {
		const routeDataParser = DPE.string().setIdentifier("RouteParser");
		const explicitDataParser = DPE.number().setIdentifier("ExplicitParser");

		const route = useRouteBuilder("GET", "/generated")
			.extract({
				body: routeDataParser,
			})
			.handler(
				ResponseContract.noContent("generated.success"),
				(__, { response }) => response("generated.success"),
			);

		const hub = createHub({ environment: "DEV" })
			.plug(codeGeneratorPlugin({
				outputFile: "routes.d.ts",
				generateDataParser: {
					outputFolder: "generated",
					disabledFromRoute: true,
					dataParsers: [explicitDataParser],
				},
			}))
			.register(route);

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeStartServer"),
			hub,
			{} as any,
		);

		expect(spy.mock.calls).toHaveLength(4);
		expect(spy.mock.calls[0]).toMatchSnapshot();
		expect(spy.mock.calls[1]).toMatchSnapshot();
		expect(spy.mock.calls[2]).toMatchSnapshot();
		expect(spy.mock.calls[3]).toMatchSnapshot();
	});

	it("remove existing generated folder before recreating it", async() => {
		spyExists.mockImplementationOnce((path: string) => Promise.resolve(E.ok()));

		const explicitDataParser = DPE.number().setIdentifier("ExplicitParser");

		const route = useRouteBuilder("GET", "/generated")
			.handler(
				ResponseContract.noContent("generated.success"),
				(__, { response }) => response("generated.success"),
			);

		const hub = createHub({ environment: "DEV" })
			.plug(codeGeneratorPlugin({
				outputFile: "routes.d.ts",
				generateDataParser: {
					outputFolder: "generated",
					disabledFromRoute: true,
					dataParsers: [explicitDataParser],
				},
			}))
			.register(route);

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeStartServer"),
			hub,
			{} as any,
		);

		expect(spyExists).toHaveBeenCalledWith("generated");
		expect(spyRemove).toHaveBeenCalledWith("generated", { recursive: true });
		expect(spyMakeDirectory).toHaveBeenCalledWith("generated");
	});
});
