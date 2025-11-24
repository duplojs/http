import { RouterBuildError } from "@core";
import { testRoute } from "@test-utils/route";

it("buildError", () => {
	const error = new RouterBuildError(testRoute);

	expect(error).instanceOf(Error);
	expect(error).instanceOf(RouterBuildError);
	expect(error.element).toBe(testRoute);
});
