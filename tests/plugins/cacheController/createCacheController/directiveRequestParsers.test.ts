import { type ExpectType } from "@duplojs/utils";
import { directiveRequestParsers } from "@plugin-cacheController/hooks/createCacheController/directiveRequestParsers";
import { parseExtensionsDirective } from "@plugin-cacheController/hooks/createCacheController/directiveRequestParsers/parseExtensionsDirective";
import { parseMaxAgeDirective } from "@plugin-cacheController/hooks/createCacheController/directiveRequestParsers/parseMaxAgeDirective";
import { parseMaxStaleDirective } from "@plugin-cacheController/hooks/createCacheController/directiveRequestParsers/parseMaxStaleDirective";
import { parseMinFreshDirective } from "@plugin-cacheController/hooks/createCacheController/directiveRequestParsers/parseMinFreshDirective";
import { parseMustUnderstandDirective } from "@plugin-cacheController/hooks/createCacheController/directiveRequestParsers/parseMustUnderstandDirective";
import { parseNoCacheDirective } from "@plugin-cacheController/hooks/createCacheController/directiveRequestParsers/parseNoCacheDirective";
import { parseNoStoreDirective } from "@plugin-cacheController/hooks/createCacheController/directiveRequestParsers/parseNoStoreDirective";
import { parseNoTransformDirective } from "@plugin-cacheController/hooks/createCacheController/directiveRequestParsers/parseNoTransformDirective";
import { parseOnlyIfCachedDirective } from "@plugin-cacheController/hooks/createCacheController/directiveRequestParsers/parseOnlyIfCachedDirective";
import type { CacheControlRequestDirectives } from "@plugin-cacheController/hooks/createCacheController/types";

describe("directiveRequestParsers", () => {
	it("maps each directive to the expected parser", () => {
		expect(directiveRequestParsers).toStrictEqual({
			maxAge: parseMaxAgeDirective,
			maxStale: parseMaxStaleDirective,
			minFresh: parseMinFreshDirective,
			noCache: parseNoCacheDirective,
			noStore: parseNoStoreDirective,
			noTransform: parseNoTransformDirective,
			onlyIfCached: parseOnlyIfCachedDirective,
			mustUnderstand: parseMustUnderstandDirective,
			extensions: parseExtensionsDirective,
		});
	});

	it("propagates the expected parser return types", () => {
		const maxAge = directiveRequestParsers.maxAge("max-age=60");
		const maxStale = directiveRequestParsers.maxStale("max-stale");
		const minFresh = directiveRequestParsers.minFresh("min-fresh=20");
		const noCache = directiveRequestParsers.noCache("no-cache");
		const noStore = directiveRequestParsers.noStore("no-store");
		const noTransform = directiveRequestParsers.noTransform("no-transform");
		const onlyIfCached = directiveRequestParsers.onlyIfCached("only-if-cached");
		const mustUnderstand = directiveRequestParsers.mustUnderstand("must-understand");
		const extensions = directiveRequestParsers.extensions("x-test=value");

		type CheckMaxAge = ExpectType<typeof maxAge, CacheControlRequestDirectives["maxAge"], "strict">;
		type CheckMaxStale = ExpectType<typeof maxStale, CacheControlRequestDirectives["maxStale"], "strict">;
		type CheckMinFresh = ExpectType<typeof minFresh, CacheControlRequestDirectives["minFresh"], "strict">;
		type CheckNoCache = ExpectType<typeof noCache, CacheControlRequestDirectives["noCache"], "strict">;
		type CheckNoStore = ExpectType<typeof noStore, CacheControlRequestDirectives["noStore"], "strict">;
		type CheckNoTransform = ExpectType<typeof noTransform, CacheControlRequestDirectives["noTransform"], "strict">;
		type CheckOnlyIfCached = ExpectType<typeof onlyIfCached, CacheControlRequestDirectives["onlyIfCached"], "strict">;
		type CheckMustUnderstand = ExpectType<typeof mustUnderstand, CacheControlRequestDirectives["mustUnderstand"], "strict">;
		type CheckExtensions = ExpectType<typeof extensions, CacheControlRequestDirectives["extensions"], "strict">;
	});

	it("extracts each directive value from a complete cache-control header", () => {
		const cacheControl = [
			"max-age=60",
			"max-stale=120",
			"min-fresh=30",
			"no-cache=\"authorization,set-cookie\"",
			"no-store",
			"no-transform",
			"only-if-cached",
			"must-understand",
			"x-test=value",
			"x-flag",
		].join(", ");

		expect(directiveRequestParsers.maxAge(cacheControl)).toBe(60);
		expect(directiveRequestParsers.maxStale(cacheControl)).toBe(120);
		expect(directiveRequestParsers.minFresh(cacheControl)).toBe(30);
		expect(directiveRequestParsers.noCache(cacheControl)).toStrictEqual([
			"authorization",
			"set-cookie",
		]);
		expect(directiveRequestParsers.noStore(cacheControl)).toBe(true);
		expect(directiveRequestParsers.noTransform(cacheControl)).toBe(true);
		expect(directiveRequestParsers.onlyIfCached(cacheControl)).toBe(true);
		expect(directiveRequestParsers.mustUnderstand(cacheControl)).toBe(true);
		expect(directiveRequestParsers.extensions(cacheControl)).toStrictEqual({
			"x-test": "value",
			"x-flag": undefined,
		});
	});

	it("empty cacheControl", () => {
		const cacheControl = "";

		expect(directiveRequestParsers.maxAge(cacheControl)).toBeNull();
		expect(directiveRequestParsers.maxStale(cacheControl)).toBe(false);
		expect(directiveRequestParsers.minFresh(cacheControl)).toBe(null);
		expect(directiveRequestParsers.noCache(cacheControl)).toBe(false);
		expect(directiveRequestParsers.noStore(cacheControl)).toBe(false);
		expect(directiveRequestParsers.onlyIfCached(cacheControl)).toBe(false);
		expect(directiveRequestParsers.mustUnderstand(cacheControl)).toBe(false);
		expect(directiveRequestParsers.extensions(cacheControl)).toBeNull();
	});

	it("specific test", () => {
		expect(directiveRequestParsers.minFresh(`min-fresh=${"9".repeat(309)}`)).toBe(null);
		expect(directiveRequestParsers.maxAge(`max-age=${"9".repeat(309)}`)).toBe(null);
		expect(directiveRequestParsers.maxStale(`max-stale=${"9".repeat(309)}`)).toBe(false);
	});
});
