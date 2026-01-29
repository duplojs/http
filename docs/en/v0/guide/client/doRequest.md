---
description: "Send requests with the HTTP client and available methods."
prev:
  text: "Initialize a client"
  link: "/en/v0/guide/client/initClient"
next:
  text: "Handle a response"
  link: "/en/v0/guide/client/handleResponse"
---

# Make a request

```ts twoslash
// @version: 0
// @filename: types.ts
<!--@include: @/examples/v0/guide/client/doRequest/types.d.ts-->
// @filename: main.ts
// ---cut---
<!--@include: @/examples/v0/guide/client/doRequest/client.ts-->
```

To make a request, just call the `get`, `post`, `patch`, `put`, `delete`, or `request` methods on the HTTP client. These methods return a `PromiseRequest`, which is an object that extends Promise.

If you initialized your client with typing, it will suggest the available paths and parameters for each route. No more mistakes!
