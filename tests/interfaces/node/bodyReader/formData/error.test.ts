import { BodyParseFormDataError } from "@interface-node";

it("BodyParseFormDataError", () => {
	expect(new BodyParseFormDataError("")).instanceOf(Error);
});
