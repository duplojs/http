import { createCoreLibKind, HookResponse, Response } from "@core";
import { kindHeritage } from "@duplojs/utils";

describe("hook response", () => {
	it("construct", () => {
		expect(
			{ ...new HookResponse("afterSendResponse", "200", "OK", { message: "success" }) },
		).toStrictEqual({
			"@duplojs/utils/kind/@DuplojsHttpCore/hook-response": null,
			"@duplojs/utils/kind/@DuplojsHttpCore/response": null,
			code: "200",
			information: "from-hook-OK",
			body: { message: "success" },
			headers: undefined,
			fromHook: "afterSendResponse",
		});
	});

	it("multi instance", () => {
		class CloneHookResponse extends kindHeritage(
			"hook-response",
			createCoreLibKind("hook-response"),
			Response,
		) {}

		expect((new CloneHookResponse({}, [undefined, undefined, undefined])) instanceof HookResponse).toBe(true);
		expect((new HookResponse("afterSendResponse", "200", "OK", null)) instanceof CloneHookResponse).toBe(true);
	});
});
