import type { CacheControlRequestDirectives } from "../types";

const minFreshRegex = /(?:^|,)\s*min-fresh\s*=\s*(?<value>\d+)\s*(?=,|$)/i;

export function parseMinFreshDirective(cacheControlValue: string): CacheControlRequestDirectives["minFresh"] {
	const match = minFreshRegex.exec(cacheControlValue);
	if (match?.groups?.value === undefined) {
		return null;
	}

	const integerValue = Number.parseInt(match.groups.value, 10);
	return Number.isFinite(integerValue) && integerValue >= 0
		? integerValue
		: null;
}
