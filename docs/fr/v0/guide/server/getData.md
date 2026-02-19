---
description: "Extraire et valider les données de la requête."
prev:
  text: "Créer sa première route"
  link: "/fr/v0/guide/server/firstRoute"
next:
  text: "Faire une vérification"
  link: "/fr/v0/guide/server/doCheck"
---

# Récupérer des données
```ts twoslash {5-22,27-34}
// @version: 0
<!--@include: @/examples/v0/guide/server/getData/route.ts-->
```

Pour récupérer des données sur une requête, il suffit d'appeler la méthode `extract` du route builder, ce qui ajoutera une étape d'extraction de données à votre route. Cette étape d'extraction utilise forcément un `dataParser` de la lib `@duplojs/utils`. Cela permet de valider les données avant de les utiliser.

Les données sont ensuite disponibles dans le `Floor`, qui est un objet qui contient l'accumulation de données de la route. Les données peuvent provenir d'étapes d'extraction ou d'autres étapes comme les checkeurs, les processus, les cuts, etc.


## Profondeur d'extraction
```ts twoslash {5-13}
// @version: 0
<!--@include: @/examples/v0/guide/server/getData/extractDepth.ts-->
```

L'extraction de données peut se faire sur deux niveaux. La clé de stockage sera la clé du `dataParser`. 

## Recevoir du FormData
```ts twoslash {6,11}
// @version: 0
<!--@include: @/examples/v0/guide/server/getData/formData.ts-->
```

Pour recevoir du `FormData`, il vous suffit de configurer un `bodyController` sur votre route. Cela permet d'indiquer à la route qu'elle doit se préparer à recevoir un flux de `FormData` lors d'une requête. Les paramètres définis pour ce `bodyController` s'appliquent pendant le flux du body, contrairement au `dataParser` qui s'applique après la réception du body.

::: info
Les schémas d'extraction peuvent avoir la même complexité que ceux d'un JSON, car le serializer de `FormData` utilisé permet des niveaux de profondeur supérieurs au `FormData` de base.

L'extraction de fichiers se fait via le `dataParser` file (`SDPE.file()`) provenant de la librairie `@duplojs/server-utils`.
:::
