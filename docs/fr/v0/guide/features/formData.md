---
description: "Gérer des FormData à structure complexe."
prev:
  text: "Gestion cookie"
  link: "/fr/v0/guide/plugins/cookie"
next:
  text: "Server-Sent Events (SSE)"
  link: "/fr/v0/guide/features/SSE"
---

# FormData avancés
Il est très simple de gérer des `FormData` à structure complexe et profonde en utilisant le `bodyController` adapté.

```ts twoslash {6,13}
// @version: 0
<!--@include: @/examples/v0/guide/features/formData/route.ts-->
```

Ici, la fonction `controlBodyAsFormData` définit la quantité maximale de fichiers autorisée dans la payload. L'extraction des données se fait comme pour du `JSON`, à la différence près que vous pouvez également utiliser le `dataParser` de fichier du serveur (`SDPE.file()`).

## Envoyer du FormData côté client
Pour envoyer des `FormData` à structure complexe, il vous suffit d'utiliser le client.

```ts twoslash
// @version: 0
// @filename: types.ts
<!--@include: @/examples/v0/guide/features/formData/types.d.ts-->
// @filename: main.ts
// ---cut---
<!--@include: @/examples/v0/guide/features/formData/client.ts-->
```

Il suffit d'utiliser la fonction `createFormData` de la librairie `@duplojs/utils` pour obtenir un `TheFormData` (une classe étendue de `FormData`) qui supporte les structures complexes. Lorsque le client détecte que le body est un `TheFormData`, il ajoute automatiquement un en-tête personnalisé pour l'indiquer au serveur (`x-duplojs-body-options: advanced`). Cela permet également de rester compatible avec des `FormData` classiques.
