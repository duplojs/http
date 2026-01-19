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

	it("createHookRouteLifeCycle with request modifier", () => {
		expect(
			createHookRouteLifeCycle(
				({ addRequestProperties }) => addRequestProperties({ yy: 123 }),
				{
					afterSendResponse: ({ exit, request }) => {
						type Check = ExpectType<
							typeof request,
							Request & { yy: number },
							"strict"
						>;

						return exit();
					},
				},
			),
		).toStrictEqual({
			onConstructRequest: expect.any(Function),
			afterSendResponse: expect.any(Function),
		});
	});
});
