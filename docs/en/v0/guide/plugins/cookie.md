---
description: "Parse and serialize HTTP cookies"
prev:
  text: "Cache control"
  link: "/en/v0/guide/plugins/cacheController"
next:
  text: "Advanced FormData"
  link: "/en/v0/guide/features/formData"
---

# Cookie handling

`@duplojs/http/cookie` lets you read cookies sent by the client and send them back easily in responses.

It is useful when you want to:

- read a value from incoming cookies
- set a new cookie in a response
- ask the client to delete an existing cookie

## With `cookiePlugin`

```ts twoslash {2,7-9,22-24}
// @version: 0
<!--@include: @/examples/v0/guide/plugins/cookie/plugin.ts-->
```

In this example:

- the plugin is registered once on the `Hub`
- every route registered in this `Hub` then benefits from input parsing and output serialization
- the route extracts `session` directly from `cookies`
- the handler also sends back a new cookie with `setCookie`

This is the simplest approach when cookie support should be available across your whole application.

You can also pass your own `parser` and `serializer` to the plugin.
This can be useful for signed cookies, custom encoding rules, or any project-specific format.

If you use `cookiePlugin` globally, you can exclude a specific route with `IgnoreRouteCookieMetadata`.
This lets you keep the plugin enabled everywhere while automatically removing cookie hooks from some routes.

## With hooks directly on one route

On a route, there are three ways to register cookie hooks:

- let `cookiePlugin` add them automatically
- add `cookieHooks` to get input parsing and output serialization at once
- add `parseRequestCookieHook` and `serializeResponseCookieHook` separately if you want more targeted behavior

If you want both behaviors directly on a route without using the plugin, `cookieHooks` is the simplest form.

```ts twoslash {2,6-9}
// @version: 0
<!--@include: @/examples/v0/guide/plugins/cookie/cookieHooks.ts-->
```

Here, the route gets the standard plugin behavior, but only for itself.
This is often the most practical form when you want to enable cookies route by route.

## With the two hooks separately on one route
```ts twoslash {2,5-12}
// @version: 0
<!--@include: @/examples/v0/guide/plugins/cookie/routeHooks.ts-->
```

This form is the most flexible.
It is useful when you only want one hook, or when input parsing and output serialization should be handled separately.
