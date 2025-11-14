import { escapeRegExp, pipe, S } from "@duplojs/utils";

export function pathToRegExp(path: string) {
	return pipe(
		path,
		escapeRegExp,
		S.replace(/\\\/$/g, ""),
		S.replace(/\\\*/g, ".*"),
		S.replace(
			/(\\\{(?:[A-zÀ-ÿ0-9_-]+)\\\})/g,
			"(?<$1>[A-zÀ-ÿ0-9_\\-. ]+)",
		),
		(regExp) => new RegExp(`^${regExp}$`),
	);
}
