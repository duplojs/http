import { insertParamsInPath } from "@client/insertParamsInPath";

describe("insertParamsInPath", () => {
	it("returns original path when params are missing", () => {
		expect(insertParamsInPath("/users/{id}", undefined)).toBe("/users/{id}");
	});

	it("replaces params in the path", () => {
		const result = insertParamsInPath("/users/{id}/posts/{postId}", {
			id: "12",
			postId: "99",
		});

		expect(result).toBe("/users/12/posts/99");
	});

	it("skips replacement when value is falsy", () => {
		const result = insertParamsInPath("/users/{id}/posts/{postId}", {
			id: "",
			postId: undefined,
		});

		expect(result).toBe("/users/{id}/posts/{postId}");
	});
});
