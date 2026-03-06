import type { CacheControlRequestDirectives } from "../types";

const onlyIfCachedRegex = /(?:^|,)\s*only-if-cached\s*(?=,|$)/i;

export function parseOnlyIfCachedDirective(cacheControlValue: string): CacheControlRequestDirectives["onlyIfCached"] {
	return onlyIfCachedRegex.test(cacheControlValue);
}
