export interface CacheControlRequestDirectives {

	/** "max-age=seconds": the client accepts a response whose age does not exceed N seconds. */
	maxAge: number | null;

	/** "max-stale" or "max-stale=seconds": accepts a stale response, optionally limited to N seconds. */
	maxStale: boolean | number;

	/** "min-fresh=seconds": the client requires the response to stay fresh for at least N more seconds. */
	minFresh: number | null;

	/**
     * "no-cache" or "no-cache=field-names"
     * In a request: asks for revalidation (do not use a cached response without revalidating),
     * optionally limited to specific fields.
     */
	noCache: boolean | string[];

	/** "no-store": do not store the request/response in caches (sensitive data, etc.). */
	noStore: boolean;

	/** "no-transform": forbids transformations (for example compression/content changes) by intermediary caches. */
	noTransform: boolean;

	/** "only-if-cached": only accept a response from a cache (otherwise cache-side 504-like behavior). */
	onlyIfCached: boolean;

	/**
     * "must-understand"
     * Modern standard directive: a cache must only store the response if it understands
     * the semantics of the included directives (useful with extensions).
     * (Can appear on responses too, but its purpose is cache understanding semantics.)
     */
	mustUnderstand: boolean;

	/**
     * Extensions: Cache-Control allows non-standard directives.
     * Example: "x-my-directive", "foo=bar"
     */
	extensions: Record<string, string | undefined> | null;
}

export interface CacheControlResponseDirectives {

	/** "max-age=seconds": freshness lifetime for browser/cache. */
	maxAge?: number;

	/** "s-maxage=seconds": like max-age, but for shared caches (proxy/CDN), and takes precedence for them. */
	sMaxAge?: number;

	/**
	 * "public": the response can be stored by shared caches (CDN/proxy)
	 * even if it would otherwise be non-cacheable.
	 */
	public?: true;

	/**
	 * "private" or "private=field-names"
	 * Cacheable only by private caches (browser), not by shared caches.
	 */
	private?: true | string[];

	/**
	 * "no-cache" or "no-cache=field-names"
	 * The response may be stored but MUST be revalidated before reuse.
	 */
	noCache?: true | string[];

	/** "no-store": do not store at all. */
	noStore?: true;

	/** "no-transform": no transformation. */
	noTransform?: true;

	/** "must-revalidate": once stale, the cache must revalidate (cannot serve stale directly). */
	mustRevalidate?: true;

	/** "proxy-revalidate": shared-cache variant of must-revalidate. */
	proxyRevalidate?: true;

	/**
	 * "immutable": the resource will not change during its freshness lifetime (useful with hashed files).
	 */
	immutable?: true;

	/**
	 * "stale-while-revalidate=seconds"
	 * The cache may serve stale content for N seconds while revalidating in the background.
	 */
	staleWhileRevalidate?: number;

	/**
	 * "stale-if-error=seconds"
	 * The cache may serve stale content for N seconds if the origin fails (5xx, timeout, etc.).
	 */
	staleIfError?: number;

	/** "must-understand": see description above. */
	mustUnderstand?: true;

	/** Non-standard extensions. */
	extensions?: Record<string, string>;
}
