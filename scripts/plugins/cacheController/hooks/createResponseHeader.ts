import { A, O, pipe } from "@duplojs/utils";
import type { CacheControlDirectives } from "../types";

export function createCacheControlResponseHeader(
	directives: CacheControlDirectives,
) {
	return pipe(
		[
			O.entry("max-age", directives.maxAge),
			O.entry("s-maxage", directives.sMaxAge),
			O.entry("public", directives.public),
			O.entry("private", directives.private),
			O.entry("no-cache", directives.noCache),
			O.entry("no-store", directives.noStore),
			O.entry("no-transform", directives.noTransform),
			O.entry("must-revalidate", directives.mustRevalidate),
			O.entry("proxy-revalidate", directives.proxyRevalidate),
			O.entry("immutable", directives.immutable),
			O.entry("stale-while-revalidate", directives.staleWhileRevalidate),
			O.entry("stale-if-error", directives.staleIfError),
			O.entry("must-understand", directives.mustUnderstand),
		],
		A.concat(directives.extensions ? O.entries(directives.extensions) : []),
		A.reduce(
			A.reduceFrom<string[]>([]),
			({ element: [key, value], lastValue, nextPush, next }) => {
				if (
					value === true
				) {
					return nextPush(lastValue, key);
				} else if (
					typeof value === "number"
					&& Number.isFinite(value)
					&& value >= 0
				) {
					return nextPush(lastValue, `${key}=${Math.trunc(value)}`);
				} else if (
					value instanceof Array
					&& A.minElements(value, 1)
				) {
					return nextPush(lastValue, `${key}="${A.join(value, ",")}"`);
				} else if (
					value !== ""
					&& typeof value === "string"
				) {
					return nextPush(lastValue, `${key}="${value}"`);
				} else {
					return next(lastValue);
				}
			},
		),
		A.join(","),
	);
}
