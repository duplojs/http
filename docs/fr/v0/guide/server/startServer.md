---
description: ""
prev:
  text: "Créer un hub"
  link: "/fr/v0/guide/server/createHub"
next:
  text: "Créer ça premier route"
  link: "/fr/v0/guide/server/firstRoute"
---

# Démarée un serveur

Il existe plusieurs plateformes sur laquelle du JavaScript back-end peut s'exécuter (node, deno, bun). C'est pour ça que `@duplojs/http` possède plusieurs interfaces afin de pouvoir lancer un serveur sur les différents environnements existants.

## Démarrage simple avec node
```ts twoslash
// @version: 0
<!--@include: @/examples/v0/guide/server/startServer/withNode.ts-->
```

Pour cela, il vous suffit simplement d'importer la fonction `createHTTPServer` de `@duplojs/http/node` et vous n'avez plus qu'à lui fournir votre `Hub` ainsi que les paramètres nécessaires pour que votre serveur soit fonctionnel.

## Utiliser un autre environment ?
Si vous voulez utiliser d'autres environnement, n'hésitez pas à consulter la [page API dédié aux interfaces](/fr/v0/api/interfaces/).
