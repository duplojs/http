import { pathToRegExp } from "@core";

it("pathToRegExp", () => {
	expect(pathToRegExp("/users").source)
		.toBe("^\\/users\\/?$");
	expect(pathToRegExp("/users/{userId}").source)
		.toBe("^\\/users\\/(?<userId>[A-zÀ-ÿ0-9_\\-. ]+)\\/?$");
	expect(pathToRegExp("/users-ok/*").source)
		.toBe("^\\/users\\-ok\\/.*\\/?$");
	expect(pathToRegExp("/usersOk/[{userid}]").source)
		.toBe("^\\/usersOk\\/\\[(?<userid>[A-zÀ-ÿ0-9_\\-. ]+)\\]\\/?$");
	expect(pathToRegExp("/{userId}-{toto}").source)
		.toBe("^\\/(?<userId>[A-zÀ-ÿ0-9_\\-. ]+)\\-(?<toto>[A-zÀ-ÿ0-9_\\-. ]+)\\/?$");
});
