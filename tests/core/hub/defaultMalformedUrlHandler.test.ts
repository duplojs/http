import { defaultMalformedUrlHandler } from "@core";

it("defaultMalformedUrlHandler", () => {
	expect(
		defaultMalformedUrlHandler
			.definition
			.theFunction(
				{},
				{
					response: (...args: never) => args,
					request: {
						url: "/%E0%A4%A?value=%E0%A4",
					},
				} as any,
			),
	).toStrictEqual([
		"malformed-url",
		undefined,
	]);
});
