---
description: ""
prev:
  text: "Get data"
  link: "/en/v0/guide/server/getData"
next:
  text: "Build a check routine"
  link: "/en/v0/guide/server/doCheckRoutine"
---

# Run a check

You can standardize your checks within a route very easily with a `checker`.

```ts twoslash
// @version: 0
// @filename: findOneUser.ts
<!--@include: @/examples/v0/guide/server/doCheck/findOneUser.ts-->
// @filename: main.ts
// ---cut---
<!--@include: @/examples/v0/guide/server/doCheck/checker.ts-->
```

To create a checker, simply import the `useCheckerBuilder` function from `@duplojs/http` and call the builder’s `handler` method. What matters is defining your checker’s `input`, and correctly defining its outputs.

::: info 
Outputs are accompanied by an `information` value, which makes it easy to discriminate which output you got.
:::

## Implementing a checker in a route

```ts twoslash {12-20}
// @version: 0
// @filename: findOneUser.ts
<!--@include: @/examples/v0/guide/server/doCheck/findOneUser.ts-->
// @filename: schema.ts
<!--@include: @/examples/v0/guide/server/doCheck/schema.ts-->
// @filename: checker.ts
<!--@include: @/examples/v0/guide/server/doCheck/checker.ts-->
// @filename: main.ts
// ---cut---
<!--@include: @/examples/v0/guide/server/doCheck/route.ts-->
```

To use a checker, call the `check` method on the route builder. Pass the checker as the first argument and configure its implementation:
- `input`: passes the input value to the `checker` from the `Floor`.
- `result`: defines the expected information to move to the next step.
- `otherwise`: defines the response returned if the information received from the checker does not match the expected `result`.
- `indexing`: defines the key where the data associated with the defined `result` will be indexed.

## Go faster
You can go much faster by creating a `presetChecker`.

```ts twoslash
// @version: 0
// @filename: findOneUser.ts
<!--@include: @/examples/v0/guide/server/doCheck/findOneUser.ts-->
// @filename: checker.ts
<!--@include: @/examples/v0/guide/server/doCheck/checker.ts-->
// @filename: main.ts
// ---cut---
<!--@include: @/examples/v0/guide/server/doCheck/presetChecker.ts-->
```

Simply import the `createPresetChecker` function from `@duplojs/http` and define its default implementation options.

```ts twoslash {12-15}
// @version: 0
// @filename: findOneUser.ts
<!--@include: @/examples/v0/guide/server/doCheck/findOneUser.ts-->
// @filename: schema.ts
<!--@include: @/examples/v0/guide/server/doCheck/schema.ts-->
// @filename: checker.ts
<!--@include: @/examples/v0/guide/server/doCheck/checker.ts-->
// @filename: presetChecker.ts
<!--@include: @/examples/v0/guide/server/doCheck/presetChecker.ts-->
// @filename: main.ts
// ---cut---
<!--@include: @/examples/v0/guide/server/doCheck/routeWithPresetChecker.ts-->
```

Use the `presetCheck` method on the route builder and easily implement your `checker`, remembering an input function to send the data you want.

## Special case
Sometimes you’re in a situation where creating a `checker` to factor code isn’t useful. You just want to call a function and continue or stop the route execution. That’s what `cut` steps are for.

```ts twoslash {12-30}
// @version: 0
// @filename: findOneUser.ts
<!--@include: @/examples/v0/guide/server/doCheck/findOneUser.ts-->
// @filename: schema.ts
<!--@include: @/examples/v0/guide/server/doCheck/schema.ts-->
// @filename: main.ts
// ---cut---
<!--@include: @/examples/v0/guide/server/doCheck/routeWithCut.ts-->
```

Use the `cut` method on the route builder to create your custom step. It’s similar to the `handler` method, except it isn’t the last step of your route. In a `cut` step you can respond or move to the next step, with the option to add data to the route.

::: warning 
The examples above do not encourage writing business logic in a checker or a cut. They are only there to illustrate the different functions and tools available so you can evaluate the potential and become autonomous as quickly as possible.
:::
