import { createHookRouteLifeCycle, type Request } from "@core";
import { type ExpectType } from "@duplojs/utils";

describe("hookRouteLifeCycle", () => {
	it("createHookRouteLifeCycle", () => {
		expect(
			createHookRouteLifeCycle({
				afterSendResponse: ({ exit }) => exit(),
			}),
		).toStrictEqual({
			afterSendResponse: expect.any(Function),
		});
	});
});
