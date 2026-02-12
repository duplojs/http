import { WrongContentTypeError } from "@core";

it("WrongContentTypeError", () => {
	expect(new WrongContentTypeError(1000)).instanceOf(Error);
});
