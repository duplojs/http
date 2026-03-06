import { type CacheControlRequestDirectives } from "../types";
import { parseExtensionsDirective } from "./parseExtensionsDirective";
import { parseMaxAgeDirective } from "./parseMaxAgeDirective";
import { parseMaxStaleDirective } from "./parseMaxStaleDirective";
import { parseMinFreshDirective } from "./parseMinFreshDirective";
import { parseMustUnderstandDirective } from "./parseMustUnderstandDirective";
import { parseNoCacheDirective } from "./parseNoCacheDirective";
import { parseNoStoreDirective } from "./parseNoStoreDirective";
import { parseNoTransformDirective } from "./parseNoTransformDirective";
import { parseOnlyIfCachedDirective } from "./parseOnlyIfCachedDirective";

export const directiveRequestParsers = {
	maxAge: parseMaxAgeDirective,
	maxStale: parseMaxStaleDirective,
	minFresh: parseMinFreshDirective,
	noCache: parseNoCacheDirective,
	noStore: parseNoStoreDirective,
	noTransform: parseNoTransformDirective,
	onlyIfCached: parseOnlyIfCachedDirective,
	mustUnderstand: parseMustUnderstandDirective,
	extensions: parseExtensionsDirective,
} satisfies Record<keyof CacheControlRequestDirectives, unknown>;
