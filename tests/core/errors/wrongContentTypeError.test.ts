import { WrongContentTypeError } from "@core";

it("WrongContentTypeError", () => {
	expect(new WrongContentTypeError("", "")).instanceOf(Error);
});
