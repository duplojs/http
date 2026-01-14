import { launchHookServer, ResponseContract, useRouteBuilder } from "@core";
import { DPE } from "@duplojs/utils";
import { openApiGeneratorPlugin } from "@plugin-openApiGenerator";
import { testHub } from "@test-utils/hub";
import { type Mock } from "vitest";

vi.mock("node:fs/promises", () => ({
	writeFile: vi.fn(),
}));

const { writeFile } = await import("node:fs/promises");

describe("plugin implementation", () => {
	beforeEach(() => {
		(writeFile as Mock).mockClear();
	});

	const route = useRouteBuilder("GET", "/user")
		.extract({
			headers: {
				header1: DPE.string(),
				header2: DPE.string(),
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

	it("generate OpenApi file", async() => {
		const hub = testHub
			.plug(openApiGeneratorPlugin({ outputFile: "swagger.json" }))
			.register(route);

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeStartServer"),
			hub,
			{},
		);

		expect((writeFile as Mock).mock.lastCall?.at(0)).toBe("swagger.json");
		expect((writeFile as Mock).mock.lastCall?.at(1)).toMatchSnapshot();
	});

	it("generate OpenApi file with type bearer ok security option", async() => {
		const hub = testHub
			.plug(
				openApiGeneratorPlugin({
					outputFile: "swagger.json",
					security: { type: "bearer" },
				}),
			)
			.register(route);

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeStartServer"),
			hub,
			{},
		);

		expect((writeFile as Mock).mock.lastCall?.at(0)).toBe("swagger.json");
		expect((writeFile as Mock).mock.lastCall?.at(1)).toMatchSnapshot();
	});

	it("generate OpenApi file with type apiKey ok security option", async() => {
		const hub = testHub
			.plug(openApiGeneratorPlugin({
				outputFile: "swagger.json",
				security: {
					type: "apiKey",
					in: "cookie",
					paramName: "token",
				},
			}))
			.register(route);

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeStartServer"),
			hub,
			{},
		);

		expect((writeFile as Mock).mock.lastCall?.at(0)).toBe("swagger.json");
		expect((writeFile as Mock).mock.lastCall?.at(1)).toMatchSnapshot();
	});

	it("not generate OpenApi file", async() => {
		const hub = testHub
			.plug(openApiGeneratorPlugin({ outputFile: "swagger.json" }));

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeStartServer"),
			hub,
			{},
		);

		expect(writeFile).not.toHaveBeenCalled();
	});
});
