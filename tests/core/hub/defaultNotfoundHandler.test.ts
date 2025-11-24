import { defaultNotfoundHandler } from "@core";

it("defaultNotfoundHandler", () => {
	expect(
		defaultNotfoundHandler
			.definition
			.theFunction(
				{},
				{
					response: (...args: never) => args,
					request: {
						method: "GET",
						path: "/path/to/a",
					},
				} as any,
			),
	).toStrictEqual([
		"notfound-route",
		"GET:/path/to/a",
	]);
});
