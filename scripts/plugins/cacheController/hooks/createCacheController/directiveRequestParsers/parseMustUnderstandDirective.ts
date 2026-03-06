import type { CacheControlRequestDirectives } from "../types";

const mustUnderstandRegex = /(?:^|,)\s*must-understand\s*(?=,|$)/i;

export function parseMustUnderstandDirective(cacheControlValue: string): CacheControlRequestDirectives["mustUnderstand"] {
	return mustUnderstandRegex.test(cacheControlValue);
}
