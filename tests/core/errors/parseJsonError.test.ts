import { ParseJsonError } from "@core";

it("ParseJsonError", () => {
	expect(new ParseJsonError("", "")).instanceOf(Error);
});
