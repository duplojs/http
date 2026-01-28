---
description: ""
prev:
  text: "Handle a response"
  link: "/en/v0/guide/client/handleResponse"
next:
  text: "OpenAPI generation"
  link: "/en/v0/guide/plugins/openApiGenerator"
---

# Code generation
```ts twoslash {7}
// @version: 0
<!--@include: @/examples/v0/guide/plugins/codeGenerator/hub.ts-->
```

To generate typing for all your routes, use the `codeGeneratorPlugin` function from `@duplojs/http/codeGenerator` in the `Hub` and start with the environment variable set to `DEV` or `BUILD`.

The `outputFile` parameter lets you define which file the code will be written to.

::: warning
You must have an HTTP server implementation, because the plugin hooks into `beforeStartServer`, which only runs via interface functions like `createHttpServer`. Run with the `Hub` configured in `BUILD` mode so the HTTP server doesn’t start.
:::
