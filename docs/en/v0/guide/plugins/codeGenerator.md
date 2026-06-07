---
description: "Generate route typings with codeGenerator plugin."
prev:
  text: "Client cache"
  link: "/en/v0/guide/client/clientCache"
next:
  text: "OpenAPI generation"
  link: "/en/v0/guide/plugins/openApiGenerator"
---

# Code generation
```ts twoslash {7}
// @version: 0
<!--@include: @/examples/v0/guide/plugins/codeGenerator/hub.ts-->
```

To generate typings for all your routes, use the `codeGeneratorPlugin` function from `@duplojs/http/codeGenerator` in the `Hub`, then start with the environment variable set to `DEV` or `BUILD`.

- The `outputFile` parameter defines the file where route typings will be written.
- The `generateDataParser.outputFolder` parameter defines the folder where identified data parsers will be generated.
- The `generateDataParser.disabledFromRoute` parameter disables data parser generation from routes.
- The `generateDataParser.dataParsers` parameter lets you provide a list of data parsers to generate. In that case, only identified data parsers will be generated.

::: warning
You must have an HTTP server implementation, because the plugin hooks into `beforeStartServer`, which only runs through interface functions such as `createHttpServer`. Run with the `Hub` configured in `BUILD` mode to avoid starting the HTTP server.
:::
