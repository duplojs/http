import { createCoreLibStringIdentifier } from "@core";

describe("createCoreLibStringIdentifier", () => {
	it("build identifier string with prefix", () => {
		const identifier = createCoreLibStringIdentifier("my-value");

		expect(identifier).toBe("@duplojs/http/core/my-value");
	});
});
