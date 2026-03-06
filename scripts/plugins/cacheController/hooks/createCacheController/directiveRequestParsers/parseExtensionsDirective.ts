import { createEnum, O } from "@duplojs/utils";
import type { CacheControlRequestDirectives } from "../types";

const extensionRegex = /(?:^|,)\s*(?<name>[!#$%&'*+.^_`|~0-9a-z-]+)(?:\s*=\s*(?:"[ ]*(?<quotedValue>[^"]*)[ ]*"|[ ]*(?<rawValue>[^,]*)[ ]*))?\s*(?=,|$)/gi;

const defaultCacheControlDirectiveEnum = createEnum(
	[
		"max-age",
		"max-stale",
		"min-fresh",
		"no-cache",
		"no-store",
		"no-transform",
		"only-if-cached",
		"must-understand",
	],
);

export function parseExtensionsDirective(cacheControlValue: string): CacheControlRequestDirectives["extensions"] {
	const extensions: Record<string, string | undefined> = {};

	for (const match of cacheControlValue.matchAll(extensionRegex)) {
		const directiveName = match.groups?.name?.toLowerCase();
		if (!directiveName || defaultCacheControlDirectiveEnum.has(directiveName)) {
			continue;
		}

		extensions[directiveName] = match.groups?.quotedValue ?? match.groups?.rawValue;
	}

	return O.countKeys(extensions) > 0
		? extensions
		: null;
}
