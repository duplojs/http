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

```ts twoslash {2,7-9,23-27,31-33}
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

## With hooks directly on one route

```ts twoslash {2-7,11-18}
// @version: 0
<!--@include: @/examples/v0/guide/plugins/cookie/routeHooks.ts-->
```

Here, the `Hub` is not globally configured with `cookiePlugin`.
The route registers the hooks it needs by itself.

This form is useful when you want to:

- limit cookie usage to only a few routes
- choose your own parser or serializer
- register only one hook if needed, for example only input parsing or only output serialization

Just like with the plugin, each hook can receive its own parser or serializer.
This is useful when you want route-specific behavior, for example to sign or verify sensitive cookies.
