import { D, E } from "@duplojs/utils";
import { setEnvironment, SF, TESTImplementation } from "@duplojs/server-utils";
import { PredictedResponse, Request } from "@core";
import "@plugin-cacheController";
import { makeRouteFolder } from "@plugin-static";
import { useTestRouteFunctionBuilder } from "@test-utils/useTestRouteFunctionBuilder";
import { createBodyReader } from "@test-utils/bodyReader";

describe("makeRouteFolder", async() => {
	setEnvironment("TEST");
	const spyResponse = vi.fn();

	beforeEach(() => {
		spyResponse.mockClear();
	});

	const source = SF.createFolderInterface("/tmp/folder");
	const source2 = SF.createFolderInterface("/tmp/folder");

	const route = makeRouteFolder({
		prefix: "/folder",
		source,
	});
	const route2 = makeRouteFolder({
		prefix: "/folder",
		source,
		cacheControlConfig: {
			maxAge: 100,
			public: true,
		},
		directoryIndexFilePrefix: "index.txt",
	});

	const buildedRoute = await useTestRouteFunctionBuilder(
		route,
		{
			globalHooksRouteLifeCycle: [{ afterSendResponse: spyResponse }],
		},
	);
	const buildedRoute2 = await useTestRouteFunctionBuilder(
		route2,
		{
			globalHooksRouteLifeCycle: [{ afterSendResponse: spyResponse }],
		},
	);

	it("source found", async() => {
		const modifiedAt = D.create("2020-01-01");

		const defaultStat = {
			isFile: true,
			modifiedAt,
		} as SF.StatInfo;
		const spyStat = vi.fn(() => Promise.resolve(E.success(defaultStat)));
		TESTImplementation.set("stat", spyStat);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "/folder/file.txt",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse(
					"200",
					"resource.found",
					expect.objectContaining({
						path: "/tmp/folder/file.txt",
					}),
				)
					.setHeader("last-modified", modifiedAt.toISOString()),
			}),
		);
	});

	it("source found but source modifiedAt does not exist", async() => {
		const defaultStat = {
			isFile: true,
			modifiedAt: null,
		} as SF.StatInfo;
		const spyStat = vi.fn(() => Promise.resolve(E.success(defaultStat)));
		TESTImplementation.set("stat", spyStat);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "/folder/file.txt",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse(
					"200",
					"resource.found",
					expect.objectContaining({
						path: "/tmp/folder/file.txt",
					}),
				),
			}),
		);
	});

	it("source notModified", async() => {
		const modifiedAt = D.create("2020-01-01");

		const defaultStat = {
			isFile: true,
			modifiedAt,
		} as SF.StatInfo;
		const spyStat = vi.fn(() => Promise.resolve(E.success(defaultStat)));
		TESTImplementation.set("stat", spyStat);

		await buildedRoute(
			new Request({
				headers: {
					"if-modified-since": modifiedAt.toISOString(),
				},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "/folder/file.txt",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("304", "resource.notModified", undefined)
					.setHeader("last-modified", modifiedAt.toISOString()),
			}),
		);
	});

	it("path not absolute", async() => {
		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "/folder/../folder2/file.txt",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("404", "resource.notfound", undefined),
			}),
		);
	});

	it("resource requested notfound", async() => {
		const spyStat = vi.fn(() => Promise.resolve(E.left("file-system-stat")));
		TESTImplementation.set("stat", spyStat);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "/folder/file.txt",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("404", "resource.notfound", undefined),
			}),
		);
	});

	it("resource requested is not a file", async() => {
		const defaultStat = {
			isFile: false,
		} as SF.StatInfo;
		const spyStat = vi.fn(() => Promise.resolve(E.success(defaultStat)));
		TESTImplementation.set("stat", spyStat);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "/folder/file.txt",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("404", "resource.notfound", undefined),
			}),
		);
	});

	it("index resource found", async() => {
		const modifiedAt = D.create("2020-01-01");
		const spyStat = vi.fn()
			.mockResolvedValueOnce(
				E.success(
					{
						isFile: false,
					} as SF.StatInfo,
				),
			)
			.mockResolvedValueOnce(
				E.success(
					{
						isFile: true,
						modifiedAt,
					} as SF.StatInfo,
				),
			);
		TESTImplementation.set("stat", spyStat);

		await buildedRoute2(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "/folder/childrenFolder",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse(
					"200",
					"resource.found",
					expect.objectContaining({
						path: "/tmp/folder/childrenFolder/index.txt",
					}),
				)
					.setHeaders({
						"last-modified": modifiedAt.toISOString(),
						"cache-control": "max-age=100,public",
					}),
			}),
		);
	});

	it("index resource is not exist", async() => {
		const spyStat = vi.fn()
			.mockResolvedValueOnce(
				E.success(
					{
						isFile: false,
					} as SF.StatInfo,
				),
			)
			.mockResolvedValueOnce(
				E.left("file-system-stat"),
			);
		TESTImplementation.set("stat", spyStat);

		await buildedRoute2(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "/folder/childrenFolder",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("404", "resource.notfound", undefined),
			}),
		);
	});

	it("index resource is not a file", async() => {
		const spyStat = vi.fn()
			.mockResolvedValueOnce(
				E.success(
					{
						isFile: false,
					} as SF.StatInfo,
				),
			)
			.mockResolvedValueOnce(
				E.success(
					{
						isFile: false,
					} as SF.StatInfo,
				),
			);
		TESTImplementation.set("stat", spyStat);

		await buildedRoute2(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "/folder/childrenFolder",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("404", "resource.notfound", undefined),
			}),
		);
	});
});
