import { setAtPath } from "@interface-node";

describe("setAtPath", () => {
	it("", () => {
		const result = {};

		setAtPath(result, "test//ok//[0]////prop", 1);
		setAtPath(result, "test//ok//[0]////toto", "superValue");
		setAtPath(result, "test//ok//[0]////sub//[0]", "ok");
		setAtPath(result, "test//ok//[1]", 2);
		setAtPath(result, "test//", "val");

		expect(result).toStrictEqual({
			test: {
				ok: [
					{
						"": {
							prop: 1,
							toto: "superValue",
							sub: ["ok"],
						},
					},
					2,
				],
				"": "val",
			},
		});
	});
});
