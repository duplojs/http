---
description: ""
prev:
  text: "Create a hub"
  link: "/en/v0/guide/server/createHub"
next:
  text: "Create your first route"
  link: "/en/v0/guide/server/firstRoute"
---

# Start a server

There are several platforms where back-end JavaScript can run (Node, Deno, Bun). That’s why `@duplojs/http` provides multiple interfaces so you can start a server in different environments.

## Simple start with Node
```ts twoslash
// @version: 0
<!--@include: @/examples/v0/guide/server/startServer/withNode.ts-->
```

To do that, simply import the `createHTTPServer` function from `@duplojs/http/node` and provide your `Hub` along with the parameters needed to make your server functional.

## Use another environment?
If you want to use other environments, check the [API page for interfaces](/en/v0/api/interfaces/).
