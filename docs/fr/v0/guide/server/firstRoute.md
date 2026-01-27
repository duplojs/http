---
description: ""
prev:
  text: "Démarée un server"
  link: "/fr/v0/guide/server/startServer"
next:
  text: "Récupéré de la données"
  link: "/fr/v0/guide/server/getData"
---

# Créer ça premier route

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

Il vous suffit d'importer la fonction `useRouteBuilder` de `@duplojs/http` pour commencer à créer une route. Chaque méthode appelée de ce builder permet d'ajouter une `step` à la route. L'ordre d'exécution de ces steps est séquentiel. Une route se lit donc du haut vers le bas. 

La méthode `handler` conclut la création de la route. Cette méthode ajoute automatiquement la route au `routeStore`. 

::: warning 
N'oubliez pas d'importer les fichiers contenant vos routes, sinon ceux-ci ne seront pas exécutés et les routes ne seront pas disponibles dans le `routeStore`.
```ts twoslash
// @version: 0
<!--@include: @/examples/v0/guide/server/firstRoute/hubWithImportRoute.ts-->
```
:::

## C'est quoi un `ResponseContract` ?
Les `ResponseContract` permettent de définir de manier explicite les réponses possibles d'une step. **ILS SONT OBLIGATOIRES !** 

Ils permettent :
- d'associer une information à la structure d'un body et à un statut HTTP.
- de visualiser concrètement ce que renvoie la route et d'éviter donc d'envoyer des champs supplémentaires (coucou le mot de passe en front 👋).
- d'assister pendant les tests pour être sûr des structures que vous renvoyez.
- d'être interprété au runtime pour générer des swagger ou des contrats de type pour des client http.

```ts twoslash
// @version: 0
<!--@include: @/examples/v0/guide/server/firstRoute/contracts.ts-->
```