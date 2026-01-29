---
description: "Créer des checkers et les utiliser dans une route."
prev:
  text: "Récupérer des données"
  link: "/fr/v0/guide/server/getData"
next:
  text: "Faire une routine de vérification"
  link: "/fr/v0/guide/server/doCheckRoutine"
---

# Faire une vérification

Vous pouvez normaliser vos vérifications au sein d'une route, très simplement avec un `checker`. 

```ts twoslash
// @version: 0
// @filename: findOneUser.ts
<!--@include: @/examples/v0/guide/server/doCheck/findOneUser.ts-->
// @filename: main.ts
// ---cut---
<!--@include: @/examples/v0/guide/server/doCheck/checker.ts-->
```

Pour créer un checker, il vous suffit d'importer la fonction `useCheckerBuilder` de `@duplojs/http` et d'appeler la méthode `handler` du builder. Ce qui est important, c'est de définir l'`input` de votre `checker`, mais également de correctement définir vos sorties.

::: info 
Les sorties sont accompagnées d'une `information`, ce qui permet de pouvoir discriminer la sortie facilement.
:::

## Implémentation d'un checker dans une route

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

Pour utiliser un checker, il suffit d'utiliser la méthode `check` du builder de route. Passez le checker en premier argument et configurez son implémentation :
- `input` : permet de passer la valeur d'entrée au `checker` depuis le `Floor`.
- `result` : définit l'information attendue pour passer à l'étape suivante.
- `otherwise` : définit la réponse renvoyée si l'information reçue du checker ne correspond pas au `result` attendu.
- `indexing`: définit la clé où va être indexée la donnée associée au `result` défini.

## Aller plus vite
Vous pouvez aller beaucoup plus vite en créant un `presetChecker`.

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

Il vous suffit d'importer la fonction `createPresetChecker` de `@duplojs/http` et de définir ses options d'implémentation par défaut.

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

Utilisez la méthode `presetCheck` du builder de route et implémentez facilement votre `checker`, sans oublier une fonction d'input pour lui envoyer la donnée que vous voulez.

## Cas particulier
Parfois, il arrive d'être dans un cas particulier où la création d'un `checker` pour factoriser du code n'est pas utile. Vous souhaitez juste appeler une fonction et continuer ou stopper l'exécution de la route. Il existe pour cela les étapes `cut`.

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

Utilisez la méthode `cut` du builder de route pour créer votre étape sur mesure. Celle-ci est semblable à la méthode `handler`, sauf qu'elle n'est pas la dernière étape de votre route. Vous avez la possibilité, dans une étape `cut`, de répondre ou de passer à l'étape suivante avec la possibilité d'ajouter une donnée à la route.

::: warning 
Les exemples ci-dessus n’encouragent en aucun cas à faire du code métier dans un checker ou un cut. Ils sont juste là pour illustrer les différentes fonctions et moyens que vous avez à votre disposition pour que vous puissiez évaluer le potentiel et être autonome le plus rapidement possible.
:::
