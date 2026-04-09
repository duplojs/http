---
description: "Handle application-level binary and text streams."
prev:
  text: "Server-Sent Events (SSE)"
  link: "/en/v0/guide/features/SSE"
next:
  text: ""
  link: ""
---

# Stream
You can return a continuous application stream with `ResponseContract.stream` for binary chunks, or `ResponseContract.streamText` for text chunks.

```ts twoslash
// @version: 0
<!--@include: @/examples/v0/guide/features/stream/route.ts-->
```

`stream` is suited for opaque chunks on the client side. `streamText` is more convenient when you want to consume strings directly.

## Consume the stream on the client
The client detects this response type automatically and returns an iterable object enriched with `onStream` hooks.

```ts twoslash
// @version: 0
// @filename: types.ts
<!--@include: @/examples/v0/guide/features/stream/types.d.ts-->
// @filename: main.ts
// ---cut---
<!--@include: @/examples/v0/guide/features/stream/client.ts-->
```

To consume the stream, either iterate over the response with `for await...of`, or call `consumeStream()`. The `receiveData` event receives the chunk type that matches the generated client contract.
