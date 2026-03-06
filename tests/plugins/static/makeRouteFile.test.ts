import { D, E } from "@duplojs/utils";
import { setEnvironment, SF, TESTImplementation } from "@duplojs/server-utils";
import { PredictedResponse, Request } from "@core";
import "@plugin-cacheController";
import { makeRouteFile } from "@plugin-static";
import { useTestRouteFunctionBuilder } from "@test-utils/useTestRouteFunctionBuilder";
import { createBodyReader } from "@test-utils/bodyReader";

describe("makeRouteFile", async() => {
	setEnvironment("TEST");
	const spyResponse = vi.fn();

	beforeEach(() => {
		spyResponse.mockClear();
	});

	const source = SF.createFileInterface("/tmp/file");

	const route = makeRouteFile({
		path: "/file",
		source,
		cacheControlConfig: {
			maxAge: 100,
			public: true,
		},
	});

	const buildedRoute = await useTestRouteFunctionBuilder(
		route,
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
		const spy = vi.fn(() => Promise.resolve(E.success(defaultStat)));
		TESTImplementation.set("stat", spy);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "/file",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("200", "resource.found", source)
					.setHeaders({
						"cache-control": "max-age=100,public",
						"last-modified": modifiedAt.toISOString(),
					}),
			}),
		);
	});

	it("source found no modifiedAt", async() => {
		const defaultStat = {
			isFile: true,
			modifiedAt: null,
		} as SF.StatInfo;
		const spy = vi.fn(() => Promise.resolve(E.success(defaultStat)));
		TESTImplementation.set("stat", spy);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "/file",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("200", "resource.found", source)
					.setHeaders({
						"cache-control": "max-age=100,public",
					}),
			}),
		);
	});

	it("source notModified", async() => {
		const modifiedAt = D.create("2020-01-01");

		const defaultStat = {
			isFile: true,
			modifiedAt,
		} as SF.StatInfo;
		const spy = vi.fn(() => Promise.resolve(E.success(defaultStat)));
		TESTImplementation.set("stat", spy);

		await buildedRoute(
			new Request({
				headers: {
					"if-modified-since": modifiedAt.toISOString(),
				},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "/file",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("304", "resource.notModified", undefined)
					.setHeaders({
						"cache-control": "max-age=100,public",
						"last-modified": modifiedAt.toISOString(),
					}),
			}),
		);
	});

	it("source does not file", async() => {
		const defaultStat = {
			isFile: false,
		} as SF.StatInfo;
		const spy = vi.fn(() => Promise.resolve(E.success(defaultStat)));
		TESTImplementation.set("stat", spy);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "/file",
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

	it("source does not exist", async() => {
		const spy = vi.fn(() => Promise.resolve(E.left("file-system-stat")));
		TESTImplementation.set("stat", spy);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "/file",
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
