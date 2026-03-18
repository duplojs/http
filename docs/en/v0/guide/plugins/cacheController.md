---
description: "Manage Cache-Control headers."
prev:
  text: "CORS handling"
  link: "/en/v0/guide/plugins/cors"
next:
  text: "Advanced FormData"
  link: "/en/v0/guide/features/formData"
---

# Cache control

`@duplojs/http/cacheController` provides `createCacheControllerHooks`, a hook that automatically adds the [`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control) header to matching responses.

The hook only adds the header to `2xx` and `3xx` responses.

## On one route

```ts twoslash {2,12-16}
// @version: 0
<!--@include: @/examples/v0/guide/plugins/cacheController/route.ts-->
```

In this case, the configuration only applies to the `GET /articles` route.

- `public: true` allows shared caching.
- `maxAge: 300` allows a 5-minute cache.
- `staleWhileRevalidate: 60` lets clients serve a slightly stale response while revalidating.

## On all Hub routes

```ts twoslash {2,5-10}
// @version: 0
<!--@include: @/examples/v0/guide/plugins/cacheController/hub.ts-->
```

Here, the hook is added globally with `addRouteHooks`. Every route registered in this `Hub` inherits the same cache policy.

## Config interface

```ts
interface CacheControlDirectives {
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
```

## Useful notes

- `private` and `noCache` can also receive a list of header names.
- `extensions` lets you add custom directives when you need a more specific header.
