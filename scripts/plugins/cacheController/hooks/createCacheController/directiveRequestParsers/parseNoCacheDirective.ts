import type { CacheControlRequestDirectives } from "../types";

const noCacheRegex = /(?:^|,)\s*no-cache(?:\s*=\s*(?:"[ ]*(?<quotedValue>[^"]*)[ ]*"|[ ]*(?<rawValue>[^,]*)[ ]*))?\s*(?=,|$)/i;

export function parseNoCacheDirective(cacheControlValue: string): CacheControlRequestDirectives["noCache"] {
	const match = noCacheRegex.exec(cacheControlValue);

	if (!match) {
		return false;
	}

	const value = match.groups?.quotedValue ?? match.groups?.rawValue;

	if (!value) {
		return true;
	}

	return value
		.split(/[ ]*,[ ]*/)
		.filter((fieldName) => fieldName.length > 0);
}
