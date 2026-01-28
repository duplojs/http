---
description: ""
prev:
  text: "Start a server"
  link: "/en/v0/guide/server/startServer"
next:
  text: "Get data"
  link: "/en/v0/guide/server/getData"
---

# Create your first route

```ts twoslash
// @version: 0
// @filename: schema.ts
<!--@include: @/examples/v0/guide/server/firstRoute/schema.ts-->
// @filename: getUsers.ts
<!--@include: @/examples/v0/guide/server/firstRoute/getUsers.ts-->
// @filename: main.ts
// ---cut---
<!--@include: @/examples/v0/guide/server/firstRoute/route.ts-->
```

Just import the `useRouteBuilder` function from `@duplojs/http` to start creating a route. Each method called on this builder adds a `step` to the route. The execution order of these steps is sequential. A route is read from top to bottom.

The `handler` method completes the route creation. This method automatically adds the route to the `routeStore`.

::: warning 
Don’t forget to import the files containing your routes; otherwise they won’t be executed and the routes won’t be available in the `routeStore`.
```ts twoslash
// @version: 0
<!--@include: @/examples/v0/guide/server/firstRoute/hubWithImportRoute.ts-->
```
:::

## What is a `ResponseContract`?
`ResponseContract`s let you explicitly define the possible responses of a step. **THEY ARE REQUIRED!** The body structure is defined via a `dataParser` from `@duplojs/utils`.

They allow you to:
- associate an information value with a body structure and an HTTP status.
- clearly see what the route returns and avoid sending extra fields (hello password in the frontend 👋).
- assist during tests to ensure the structures you return are correct.
- be interpreted at runtime to generate Swagger or type contracts for HTTP clients.

```ts twoslash
// @version: 0
<!--@include: @/examples/v0/guide/server/firstRoute/contracts.ts-->
```
