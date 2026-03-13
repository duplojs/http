import { EmptyBodyController, Request, defaultEmptyReaderImplementation } from "@core";
import { E } from "@duplojs/utils";

describe("defaultEmptyReaderImplementation", () => {
	it("read empty body and return undefined", async() => {
		const bodyController = EmptyBodyController.create({});
		const bodyReader = bodyController.createReaderOrThrow(
			defaultEmptyReaderImplementation,
		);
		const request = new Request({
			headers: {},
			host: "",
			matchedPath: null,
			method: "GET",
			origin: "",
			params: {},
			path: "/",
			query: {},
			url: "/",
			bodyReader,
		});

		await expect(request.getBody()).resolves.toStrictEqual(E.success(undefined));
	});
});
