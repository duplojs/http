import type { CacheControlRequestDirectives } from "../types";

const maxStaleRegex = /(?:^|,)\s*max-stale(?:\s*=\s*(?<value>\d+))?\s*(?=,|$)/i;

export function parseMaxStaleDirective(cacheControlValue: string): CacheControlRequestDirectives["maxStale"] {
	const match = maxStaleRegex.exec(cacheControlValue);
	if (!match) {
		return false;
	}

	if (match.groups?.value === undefined) {
		return true;
	}

	const integerValue = Number.parseInt(match.groups.value, 10);
	return Number.isFinite(integerValue) && integerValue >= 0
		? integerValue
		: false;
}
