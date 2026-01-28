---
description: ""
prev:
  text: "Faire une vérification"
  link: "/fr/v0/guide/server/doCheck"
next:
  text: "Initialiser un client"
  link: "/fr/v0/guide/client/initClient"
---

# Faire une routine de vérification
Dans un projet, il va très souvent arriver de vouloir faire une succession de vérifications à plusieurs endroits. 

L'exemple le plus parlant serait une authentification. Vous allez en premier récupérer un token, puis le déchiffrer et enfin vérifier que l'utilisateur existe.

C'est pour ce genre de choses que `@duplojs/http` introduit le ✨`process`✨.

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

La méthode `exports` met fin à la création d'un `process` et vous propose de mettre à disposition ses valeurs pour les routes ou processes qui l'implémenteront.

::: info
Le code ci-dessus utilise les fonctions de `@duplojs/utils`. Si certaines parties vous paraissent obscures, n'hésitez pas à checker la [documentation](https://utils.duplojs.dev/).
:::

## Implémentation d'un `process` dans une route

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

Pour implémenter un `process` dans une route, il vous suffit d'appeler la méthode `exec` du builder. Vous pouvez configurer l'implémentation en sélectionnant, par exemple, les variables que vous souhaitez importer du `process` dans votre route.

## Aller plus vite
Vous pouvez créer votre propre builder avec des `process` pré-implémentés en tant que préflight.

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

Il ne reste plus qu'à créer vos routes avec...

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
