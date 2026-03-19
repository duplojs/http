import { defaultRouterFunctionBuilder, Request, type RouterFunctionBuilderParams } from "@core";

describe("defaultRouterFunctionBuilder", () => {
	const spyMalformed = vi.fn();
	const spyNotfound = vi.fn();

	const baseParams: RouterFunctionBuilderParams = {
		classRequest: Request,
		environment: "DEV",
		malformedUrlRouterElement: {
			bodyReader: {} as never,
			buildedRoute: spyMalformed,
		},
		notfoundRouterElement: {
			bodyReader: {} as never,
			buildedRoute: spyNotfound,
		},
		routerElementWrapper: {},
	};

	afterEach(() => {
		spyMalformed.mockClear();
		spyNotfound.mockClear();
	});

	it("buildedRouter use malformed url route with fallback request values", async() => {
		const buildedRouter = await defaultRouterFunctionBuilder(baseParams);

		await buildedRouter({
			headers: {},
			host: "",
			method: "GET",
			origin: "",
			url: "/%E0%A4%A",
		});

		expect(spyMalformed).toHaveBeenCalledWith(
			new Request({
				bodyReader: {} as never,
				headers: {},
				host: "",
				method: "GET",
				origin: "",
				url: "/%E0%A4%A",
				matchedPath: null,
				params: {},
				path: "",
				query: {},
			}),
		);
		expect(spyNotfound).not.toHaveBeenCalled();
	});

	it("buildedRouter use notfound route when method group does not exist", async() => {
		const buildedRouter = await defaultRouterFunctionBuilder(baseParams);

		await buildedRouter({
			headers: {},
			host: "",
			method: "POST",
			origin: "",
			url: "/users?role=admin",
		});

		expect(spyNotfound).toHaveBeenCalledWith(
			new Request({
				bodyReader: {} as never,
				headers: {},
				host: "",
				method: "POST",
				origin: "",
				url: "/users?role=admin",
				matchedPath: null,
				params: {},
				path: "/users",
				query: { role: "admin" },
			}),
		);
		expect(spyMalformed).not.toHaveBeenCalled();
	});

	it("buildedRouter use notfound route after search route", async() => {
		const spyRoute = vi.fn();
		const buildedRouter = await defaultRouterFunctionBuilder({
			...baseParams,
			routerElementWrapper: {
				POST: [
					{
						bodyReader: {} as never,
						buildedRoute: spyRoute,
						matchedPath: "/test",
						pattern: /^\/test/,
					},
				],
			},
		});

		await buildedRouter({
			headers: {},
			host: "",
			method: "POST",
			origin: "",
			url: "/users?role=admin",
		});

		expect(spyNotfound).toHaveBeenCalledWith(
			new Request({
				bodyReader: {} as never,
				headers: {},
				host: "",
				method: "POST",
				origin: "",
				url: "/users?role=admin",
				matchedPath: null,
				params: {},
				path: "/users",
				query: { role: "admin" },
			}),
		);
		expect(spyRoute).not.toHaveBeenCalled();
		expect(spyMalformed).not.toHaveBeenCalled();
	});

	it("buildedRouter exec route", async() => {
		const spyRoute = vi.fn();
		const buildedRouter = await defaultRouterFunctionBuilder({
			...baseParams,
			routerElementWrapper: {
				POST: [
					{
						bodyReader: {} as never,
						buildedRoute: spyRoute,
						matchedPath: "/users",
						pattern: /^\/users/,
					},
				],
			},
		});

		await buildedRouter({
			headers: {},
			host: "",
			method: "POST",
			origin: "",
			url: "/users?role=admin",
		});

		expect(spyRoute).toHaveBeenCalledWith(
			new Request({
				bodyReader: {} as never,
				headers: {},
				host: "",
				method: "POST",
				origin: "",
				url: "/users?role=admin",
				matchedPath: "/users",
				params: {},
				path: "/users",
				query: { role: "admin" },
			}),
		);
		expect(spyNotfound).not.toHaveBeenCalled();
		expect(spyMalformed).not.toHaveBeenCalled();
	});

	it("buildedRouter skip route when pattern not match and execute next", async() => {
		const spyRouteSkip = vi.fn();
		const spyRoute = vi.fn();
		const buildedRouter = await defaultRouterFunctionBuilder({
			...baseParams,
			routerElementWrapper: {
				POST: [
					{
						bodyReader: {} as never,
						buildedRoute: spyRouteSkip,
						matchedPath: "/test",
						pattern: /^\/test/,
					},
					{
						bodyReader: {} as never,
						buildedRoute: spyRoute,
						matchedPath: "/users",
						pattern: /^\/users/,
					},
				],
			},
		});

		await buildedRouter({
			headers: {},
			host: "",
			method: "POST",
			origin: "",
			url: "/users?role=admin",
		});

		expect(spyRoute).toHaveBeenCalledWith(
			new Request({
				bodyReader: {} as never,
				headers: {},
				host: "",
				method: "POST",
				origin: "",
				url: "/users?role=admin",
				matchedPath: "/users",
				params: {},
				path: "/users",
				query: { role: "admin" },
			}),
		);
		expect(spyNotfound).not.toHaveBeenCalled();
		expect(spyMalformed).not.toHaveBeenCalled();
		expect(spyRouteSkip).not.toHaveBeenCalled();
	});
});
