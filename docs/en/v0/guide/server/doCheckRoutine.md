---
description: "Compose check routines with process and reuse them."
prev:
  text: "Run a check"
  link: "/en/v0/guide/server/doCheck"
next:
  text: "Initialize a client"
  link: "/en/v0/guide/client/initClient"
---

# Build a check routine
In a project, you’ll often want to run a series of checks in several places.

The clearest example is authentication. You first retrieve a token, then decrypt it, and finally verify that the user exists.

That’s why `@duplojs/http` introduces the ✨`process`✨.

```ts twoslash
// @version: 0
// @filename: findOneUser.ts
<!--@include: @/examples/v0/guide/server/doCheckRoutine/findOneUser.ts-->
// @filename: checker.ts
<!--@include: @/examples/v0/guide/server/doCheckRoutine/checker.ts-->
// @filename: checkToken.ts
<!--@include: @/examples/v0/guide/server/doCheckRoutine/checkToken.ts-->
// @filename: main.ts
// ---cut---
<!--@include: @/examples/v0/guide/server/doCheckRoutine/process.ts-->
```

The `exports` method ends the creation of a `process` and exposes its values to the routes or processes that will implement it.

::: info
The code above uses functions from `@duplojs/utils`. If some parts seem unclear, check the [documentation](https://utils.duplojs.dev/).
:::

## Implementing a `process` in a route

```ts twoslash
// @version: 0
// @filename: findOneUser.ts
<!--@include: @/examples/v0/guide/server/doCheckRoutine/findOneUser.ts-->
// @filename: checker.ts
<!--@include: @/examples/v0/guide/server/doCheckRoutine/checker.ts-->
// @filename: checkToken.ts
<!--@include: @/examples/v0/guide/server/doCheckRoutine/checkToken.ts-->
// @filename: process.ts
<!--@include: @/examples/v0/guide/server/doCheckRoutine/process.ts-->
// @filename: schema.ts
<!--@include: @/examples/v0/guide/server/doCheckRoutine/schema.ts-->
// @filename: main.ts
// ---cut---
<!--@include: @/examples/v0/guide/server/doCheckRoutine/route.ts-->
```

To implement a `process` in a route, simply call the builder’s `exec` method. You can configure the implementation by selecting, for example, the variables you want to import from the `process` into your route.

## Go faster
You can create your own builder with pre-implemented `process` steps as a preflight.

```ts twoslash
// @version: 0
// @filename: findOneUser.ts
<!--@include: @/examples/v0/guide/server/doCheckRoutine/findOneUser.ts-->
// @filename: checker.ts
<!--@include: @/examples/v0/guide/server/doCheckRoutine/checker.ts-->
// @filename: checkToken.ts
<!--@include: @/examples/v0/guide/server/doCheckRoutine/checkToken.ts-->
// @filename: process.ts
<!--@include: @/examples/v0/guide/server/doCheckRoutine/process.ts-->
// @filename: main.ts
// ---cut---
<!--@include: @/examples/v0/guide/server/doCheckRoutine/authenticatedRouteBuilder.ts-->
```

All that’s left is to create your routes with...

```ts twoslash
// @version: 0
// @filename: findOneUser.ts
<!--@include: @/examples/v0/guide/server/doCheckRoutine/findOneUser.ts-->
// @filename: checker.ts
<!--@include: @/examples/v0/guide/server/doCheckRoutine/checker.ts-->
// @filename: checkToken.ts
<!--@include: @/examples/v0/guide/server/doCheckRoutine/checkToken.ts-->
// @filename: process.ts
<!--@include: @/examples/v0/guide/server/doCheckRoutine/process.ts-->
// @filename: schema.ts
<!--@include: @/examples/v0/guide/server/doCheckRoutine/schema.ts-->
// @filename: authenticatedRouteBuilder.ts
<!--@include: @/examples/v0/guide/server/doCheckRoutine/authenticatedRouteBuilder.ts-->
// @filename: main.ts
// ---cut---
<!--@include: @/examples/v0/guide/server/doCheckRoutine/routeWithPreflight.ts-->
```
