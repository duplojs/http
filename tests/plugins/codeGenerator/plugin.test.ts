import { createHub, launchHookServer, ResponseContract, useRouteBuilder } from "@core";
import { DPE, E } from "@duplojs/utils";
import { TESTImplementation, setEnvironment } from "@duplojs/server-utils";
import { codeGeneratorPlugin } from "@plugin-codeGenerator";

describe("plugin implementation", () => {
	setEnvironment("TEST");
	const spy = vi.fn((path: string, content: string) => Promise.resolve(E.ok()));
	TESTImplementation.set("writeTextFile", spy);

	beforeEach(() => {
		spy.mockClear();
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
});
