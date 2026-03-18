---
description: "Create a static entry point easily."
prev:
  text: "OpenAPI generation"
  link: "/en/v0/guide/plugins/openApiGenerator"
next:
  text: "CORS handling"
  link: "/en/v0/guide/plugins/cors"
---

# Create a static entry point

`@duplojs/http/static` lets you expose a file or a folder in read-only mode.
You can either plug `staticPlugin` directly into the `Hub`, or manually register a route with `makeRouteFile` or `makeRouteFolder`.

## With `staticPlugin`

```ts twoslash {3,9-22}
// @version: 0
<!--@include: @/examples/v0/guide/plugins/static/plugin.ts-->
```

The plugin automatically chooses the right behavior based on the source you pass.

- `source` is a `FileInterface` or a `FolderInterface`.
- `path` exposes a single file on a specific route.
- `prefix` exposes a whole folder under a URL prefix.
- `cacheControlConfig` adds `cache-control` headers.
- `directoryFallBackFile` serves a default file for a folder, for example `index.html`.

## With `makeRouteFile`

```ts twoslash {5-12}
// @version: 0
<!--@include: @/examples/v0/guide/plugins/static/makeRouteFile.ts-->
```

Use this function when you want to register a static route yourself for a single file.

- `source` is the file to serve.
- `path` is the HTTP route to expose.
- `cacheControlConfig` is optional.

## With `makeRouteFolder`

```ts twoslash {5-13}
// @version: 0
<!--@include: @/examples/v0/guide/plugins/static/makeRouteFolder.ts-->
```

This version serves every file in a folder from a shared prefix.

- `source` is the root folder.
- `prefix` is the URL prefix used to resolve files.
- `directoryFallBackFile` serves a default file for a folder, for example `index.html`.
- `cacheControlConfig` is optional.
