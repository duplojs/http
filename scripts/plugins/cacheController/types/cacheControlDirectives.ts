export interface CacheControlDirectives {
	maxAge?: number;
	sMaxAge?: number;
	public?: true;
	private?: true | string[];
	noCache?: true | string[];
	noStore?: true;
	noTransform?: true;
	mustRevalidate?: true;
	proxyRevalidate?: true;
	immutable?: true;
	staleWhileRevalidate?: number;
	staleIfError?: number;
	mustUnderstand?: true;
	extensions?: Record<string, string>;
}
