import type { CacheControlRequestDirectives } from "../types";

const noStoreRegex = /(?:^|,)\s*no-store\s*(?=,|$)/i;

export function parseNoStoreDirective(cacheControlValue: string): CacheControlRequestDirectives["noStore"] {
	return noStoreRegex.test(cacheControlValue);
}
