---
description: ""
prev:
  text: "Créer un hub"
  link: "/fr/v0/guide/server/createHub"
next:
  text: "Créer sa première route"
  link: "/fr/v0/guide/server/firstRoute"
---

# Démarrer un serveur

Il existe plusieurs plateformes sur lesquelles du JavaScript back-end peut s'exécuter (Node, Deno, Bun). C'est pour ça que `@duplojs/http` possède plusieurs interfaces afin de pouvoir lancer un serveur sur les différents environnements existants.

## Démarrage simple avec Node
```ts twoslash
// @version: 0
<!--@include: @/examples/v0/guide/server/startServer/withNode.ts-->
```

Pour cela, il vous suffit simplement d'importer la fonction `createHTTPServer` de `@duplojs/http/node` et vous n'avez plus qu'à lui fournir votre `Hub` ainsi que les paramètres nécessaires pour que votre serveur soit fonctionnel.

## Utiliser un autre environnement ?
Si vous voulez utiliser d'autres environnements, n'hésitez pas à consulter la [page API dédiée aux interfaces](/fr/v0/api/interfaces/).
