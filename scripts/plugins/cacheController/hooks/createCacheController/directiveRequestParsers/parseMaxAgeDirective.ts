import type { CacheControlRequestDirectives } from "../types";

const maxAgeRegex = /(?:^|,)\s*max-age\s*=\s*(?<value>\d+)\s*(?=,|$)/i;

export function parseMaxAgeDirective(cacheControlValue: string): CacheControlRequestDirectives["maxAge"] {
	const match = maxAgeRegex.exec(cacheControlValue);
	if (match?.groups?.value === undefined) {
		return null;
	}

	const integerValue = Number.parseInt(match.groups.value, 10);
	return Number.isFinite(integerValue) && integerValue >= 0
		? integerValue
		: null;
}
