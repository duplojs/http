---
description: ""
prev:
  text: "Créer sa première route"
  link: "/fr/v0/guide/server/firstRoute"
next:
  text: "Faire une vérification"
  link: "/fr/v0/guide/server/doCheck"
---

# Récupérer des données
```ts twoslash
// @version: 0
<!--@include: @/examples/v0/guide/server/getData/route.ts-->
```

Pour récupérer des données sur une requête, il suffit d'appeler la méthode `extract` du route builder, ce qui ajoutera une étape d'extraction de données à votre route. Cette étape d'extraction utilise forcément un `dataParser` de la lib `@duplojs/utils`. Cela permet de valider les données avant de les utiliser.

Les données sont ensuite disponibles dans le `Floor`, qui est un objet qui contient l'accumulation de données de la route. Les données peuvent provenir d'étapes d'extraction ou d'autres étapes comme les checkeurs, les processus, les cuts, etc.


## Profondeur d'extraction
```ts twoslash
// @version: 0
<!--@include: @/examples/v0/guide/server/getData/extractDepth.ts-->
```

L'extraction de données peut se faire sur deux niveaux. La clé de stockage sera la clé du `dataParser`. 
