---
description: "Cache HTTP client responses on the client side."
prev:
  text: "Handle a response"
  link: "/en/v0/guide/client/handleResponse"
next:
  text: "Code generation"
  link: "/en/v0/guide/plugins/codeGenerator"
---

# Client cache

```ts twoslash
// @version: 0
// @filename: types.ts
<!--@include: @/examples/v0/guide/client/clientCache/types.d.ts-->
// @filename: main.ts
// ---cut---
<!--@include: @/examples/v0/guide/client/clientCache/client.ts-->
```

The HTTP client can cache responses on the client side. To enable this behavior for a request, use the `clientCache` property.

With the value `"auto"`, DuploJS builds a cache key from:
- the HTTP method
- the final path with injected params
- the query sorted by key
- the body

You can also pass a function to build your own cache key.

Only `2xx` responses are stored in cache. When a response comes from cache, the `fromCache` property is set to `true`.

Two options let you control this behavior:
- `bypassClientCache: true` fully ignores cache for the current request: no read and no write.
- `refreshClientCache: true` only bypasses cache lookup, performs the network request again, then replaces the cached value if the response is successful.

::: info
Client cache is local to the `createHttpClient` instance. Two different clients do not share the same cache store.
:::
