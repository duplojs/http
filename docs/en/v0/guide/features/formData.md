---
description: "Handle complex FormData payloads."
prev:
  text: "Cookie handling"
  link: "/en/v0/guide/plugins/cookie"
next:
  text: "Server-Sent Events (SSE)"
  link: "/en/v0/guide/features/SSE"
---

# Advanced FormData
You can handle deeply nested, complex `FormData` by using the appropriate `bodyController`.

```ts twoslash {6,13}
// @version: 0
<!--@include: @/examples/v0/guide/features/formData/route.ts-->
```

Here, the `controlBodyAsFormData` function defines the maximum number of files allowed in the payload. Data extraction works just like it does for `JSON`, except that you can also use the server file `dataParser` (`SDPE.file()`).

## Send FormData from the client
To send complex `FormData`, you just need to use the client.

```ts twoslash
// @version: 0
// @filename: types.ts
<!--@include: @/examples/v0/guide/features/formData/types.d.ts-->
// @filename: main.ts
// ---cut---
<!--@include: @/examples/v0/guide/features/formData/client.ts-->
```

Use the `createFormData` function from `@duplojs/utils` to get a `TheFormData`, an extended `FormData` class that supports complex structures. When the client detects that the body is a `TheFormData`, it automatically adds a custom header to indicate it to the server (`x-duplojs-body-options: advanced`). This also keeps it compatible with standard `FormData`.
