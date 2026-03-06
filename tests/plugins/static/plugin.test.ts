import { setEnvironment, SF, TESTImplementation } from "@duplojs/server-utils";
import { createHub, launchHookServer } from "@core";
import { staticPlugin } from "@plugin-static";
import { E } from "@duplojs/utils";

describe("static plugin implementation", () => {
	setEnvironment("TEST");

	const sourceFile = SF.createFileInterface("/tmp/file.txt");
	const sourceFolder = SF.createFolderInterface("/tmp/folder");

	const hubFile = createHub({ environment: "DEV" })
		.plug(staticPlugin(sourceFile, { path: "/file" }));

	const hubFolder = createHub({ environment: "DEV" })
		.plug(staticPlugin(sourceFolder, { prefix: "/folder" }));

	it("API file source not exist", async() => {
		const spyStat = vi.fn(() => Promise.resolve(E.left("file-system-stat")));
		TESTImplementation.set("stat", spyStat);

		await expect(
			launchHookServer(
				hubFile.aggregatesHooksHubLifeCycle("beforeStartServer"),
				hubFile,
				{} as any,
			),
		).rejects.toThrow();
	});

	it("API file source is not file", async() => {
		const spyStat = vi.fn(() => Promise.resolve(
			E.success(
				{
					isFile: false,
				} as SF.StatInfo,
			),
		));
		TESTImplementation.set("stat", spyStat);

		await expect(
			launchHookServer(
				hubFile.aggregatesHooksHubLifeCycle("beforeStartServer"),
				hubFile,
				{} as any,
			),
		).rejects.toThrow();
	});

	it("API file expect good", async() => {
		const spyStat = vi.fn(() => Promise.resolve(
			E.success(
				{
					isFile: true,
				} as SF.StatInfo,
			),
		));
		TESTImplementation.set("stat", spyStat);

		await expect(
			launchHookServer(
				hubFile.aggregatesHooksHubLifeCycle("beforeStartServer"),
				hubFile,
				{} as any,
			),
		).resolves.toBeUndefined();
	});

	it("API folder source is not folder", async() => {
		const spyStat = vi.fn(() => Promise.resolve(
			E.success(
				{
					isFile: true,
				} as SF.StatInfo,
			),
		));
		TESTImplementation.set("stat", spyStat);

		await expect(
			launchHookServer(
				hubFolder.aggregatesHooksHubLifeCycle("beforeStartServer"),
				hubFolder,
				{} as any,
			),
		).rejects.toThrow();
	});

	it("API folder expect good", async() => {
		const spyStat = vi.fn(() => Promise.resolve(
			E.success(
				{
					isFile: false,
				} as SF.StatInfo,
			),
		));
		TESTImplementation.set("stat", spyStat);

		await expect(
			launchHookServer(
				hubFolder.aggregatesHooksHubLifeCycle("beforeStartServer"),
				hubFolder,
				{} as any,
			),
		).resolves.toBeUndefined();
	});
});
