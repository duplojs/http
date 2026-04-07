---
description: "Handle PromiseRequest responses and helper methods."
prev:
  text: "Make a request"
  link: "/en/v0/guide/client/doRequest"
next:
  text: "Client cache"
  link: "/en/v0/guide/client/clientCache"
---

# Handle a response

```ts twoslash
// @version: 0
// @filename: types.ts
<!--@include: @/examples/v0/guide/client/handleResponse/types.d.ts-->
// @filename: main.ts
// ---cut---
<!--@include: @/examples/v0/guide/client/handleResponse/client.ts-->
```

The object returned by the `get`, `post`, `patch`, `put`, `delete`, or `request` methods is called `PromiseRequest`. This object has many methods to handle responses depending on your needs:
- Methods starting with `when` are simple callbacks based on their configuration.
- Methods starting with `iWant` are promises that return an `Either` of the requested result.
- Methods ending with `OrThrow` return only the successful result, but throw an error otherwise.

::: info 
The `PromiseRequest` object cannot throw an error. By default, it will always return an `Either`.
:::
