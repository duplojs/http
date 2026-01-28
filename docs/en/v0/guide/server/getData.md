---
description: ""
prev:
  text: "Create your first route"
  link: "/en/v0/guide/server/firstRoute"
next:
  text: "Run a check"
  link: "/en/v0/guide/server/doCheck"
---

# Get data
```ts twoslash {5-22,27-34}
// @version: 0
<!--@include: @/examples/v0/guide/server/getData/route.ts-->
```

To retrieve data from a request, call the `extract` method on the route builder. This adds a data extraction step to your route. This extraction step always uses a `dataParser` from the `@duplojs/utils` library. This validates the data before you use it.

The data is then available in the `Floor`, an object that contains the accumulated data for the route. Data can come from extraction steps or other steps like checkers, processes, cuts, etc.


## Extraction depth
```ts twoslash {5-13}
// @version: 0
<!--@include: @/examples/v0/guide/server/getData/extractDepth.ts-->
```

Data extraction can be done at two levels. The storage key will be the `dataParser` key.
