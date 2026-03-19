---
description: "Handle CORS headers."
prev:
  text: "Create a static entry point"
  link: "/en/v0/guide/plugins/static"
next:
  text: "Cache control"
  link: "/en/v0/guide/plugins/cacheController"
---

# CORS handling

`@duplojs/http/cors` automatically adds [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) headers to regular responses and creates an `OPTIONS /*` route to handle [preflight requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS#functional_overview).

## Full example

```ts twoslash {2,6-16}
// @version: 0
<!--@include: @/examples/v0/guide/plugins/cors/plugin.ts-->
```

In this example:

- `allowOrigin` restricts which origins are allowed.
- `allowHeaders` declares which [HTTP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers) are accepted during preflight.
- `exposeHeaders` makes selected headers readable by the browser.
- `allowMethods: true` automatically generates `access-control-allow-methods` from the routes registered in the `Hub`.
- `credentials: true` adds `access-control-allow-credentials: true` for [credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS#requests_with_credentials).
- `maxAge` defines the preflight cache duration in seconds.

## Params interface

```ts
interface CorsPluginParams {
	readonly allowOrigin?:
		| string
		| RegExp
		| readonly string[]
		| ((origin: string) => boolean | Promise<boolean>)
		| true;
	readonly allowHeaders?: string | readonly string[] | true;
	readonly exposeHeaders?: string | readonly string[];
	readonly maxAge?: number;
	readonly credentials?: boolean;
	readonly allowMethods?: RequestMethods | readonly RequestMethods[] | true;
}
```

You must provide at least one option to the plugin.

## Option details

- `allowOrigin` accepts a single origin, a list, a regular expression, a validation function, or `true` to allow all origins.
- `allowHeaders` accepts a string, a list, or `true` for all headers.
- `exposeHeaders` lists the headers the browser can read after the request.
- `allowMethods` accepts one method, a list, or `true` to compute allowed methods automatically per path.
- `credentials` enables cookies and other authentication credentials to be shared.
- `maxAge` controls how long the `OPTIONS` response can be cached.
