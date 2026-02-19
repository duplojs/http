---
description: "Extract and validate request data with extract."
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

## Receive FormData
```ts twoslash {6,11}
// @version: 0
<!--@include: @/examples/v0/guide/server/getData/formData.ts-->
```

To receive `FormData`, you just need to configure a `bodyController` on your route. This tells the route to prepare for a `FormData` stream during a request. The parameters defined for this `bodyController` are applied while streaming the body, unlike the `dataParser`, which is applied after the body is received.

::: info
Extraction schemas can be as complex as JSON schemas, because the `FormData` serializer used supports deeper nesting than the default `FormData`.

File extraction is done with the file `dataParser` (`SDPE.file()`) from `@duplojs/server-utils`.
:::
