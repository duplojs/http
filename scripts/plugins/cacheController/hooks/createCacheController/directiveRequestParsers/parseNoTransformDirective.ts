import type { CacheControlRequestDirectives } from "../types";

const noTransformRegex = /(?:^|,)\s*no-transform\s*(?=,|$)/i;

export function parseNoTransformDirective(cacheControlValue: string): CacheControlRequestDirectives["noTransform"] {
	return noTransformRegex.test(cacheControlValue);
}
