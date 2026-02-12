import { BodySizeExceedsLimitError } from "@core";

it("BodySizeExceedsLimitError", () => {
	expect(new BodySizeExceedsLimitError(1000)).instanceOf(Error);
});
