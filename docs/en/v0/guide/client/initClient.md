---
description: "Create and type an HTTP client with createHttpClient."
prev:
  text: "Build a check routine"
  link: "/en/v0/guide/server/doCheckRoutine"
next:
  text: "Make a request"
  link: "/en/v0/guide/client/doRequest"
---

# Initialize a client

```ts twoslash
// @version: 0
<!--@include: @/examples/v0/guide/client/initClient/client.ts-->
```

To create an HTTP client, just use the `createHttpClient` function from `@duplojs/http/clients`.

To fully type the client, pass a `ServerRoute`-typed object as a generic.

::: tip 
To generate the full typing for an `@duplojs/http` server, use the [`code-generator`](/en/v0/guide/plugins/codeGenerator) plugin.
:::
