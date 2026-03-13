---
description: "Handle Server-Sent Events (SSE) streams robustly."
prev:
  text: "Advanced FormData"
  link: "/en/v0/guide/features/formData"
next:
  text: ""
  link: ""
---

# Server-Sent Events (SSE)
You can handle an `SSE` stream by using the appropriate response contract.

```ts twoslash {6,13}
// @version: 0
<!--@include: @/examples/v0/guide/features/SSE/route.ts-->
```

## Handle the stream on the client
Just call a route that returns an `SSE` stream, and the client will create the appropriate response object to receive it.

```ts twoslash
// @version: 0
// @filename: types.ts
<!--@include: @/examples/v0/guide/features/SSE/types.d.ts-->
// @filename: main.ts
// ---cut---
<!--@include: @/examples/v0/guide/features/SSE/client.ts-->
```

When the client identifies an `SSE` stream, it adds methods to manipulate and consume the events it receives. To consume the stream, either iterate over the response or call `consumeEventStream`.
