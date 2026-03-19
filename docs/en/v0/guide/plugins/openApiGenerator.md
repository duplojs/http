---
description: "Generate Swagger/OpenAPI config with openApiGenerator."
prev:
  text: "Code generation"
  link: "/en/v0/guide/plugins/codeGenerator"
next:
  text: "Create a static entry point"
  link: "/en/v0/guide/plugins/static"
---

# OpenAPI generation
```ts twoslash {7-12}
// @version: 0
<!--@include: @/examples/v0/guide/plugins/openApiGenerator/hub.ts-->
```

To generate the Swagger configuration for all your routes, use the `openApiGeneratorPlugin` function from `@duplojs/http/openApiGenerator` in the `Hub` and start with the environment variable set to `DEV` or `BUILD`.

- The `outputFile` parameter lets you define which file the configuration will be written to.
- The `routePath` parameter lets you define which path exposes the Swagger UI.
- `...` The remaining parameters define options for the Swagger configuration file.

::: warning
You must have an HTTP server implementation, because the plugin hooks into `beforeServerBuildRoutes`, which only runs via interface functions like `createHttpServer`. Run with the `Hub` configured in `BUILD` mode so the HTTP server doesn’t start.
:::
