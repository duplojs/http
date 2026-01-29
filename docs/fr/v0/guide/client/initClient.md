---
description: "Créer et typer un client HTTP avec createHttpClient."
prev:
  text: "Faire une routine de vérification"
  link: "/fr/v0/guide/server/doCheckRoutine"
next:
  text: "Faire une requête"
  link: "/fr/v0/guide/client/doRequest"
---

# Initialiser un client

```ts twoslash
// @version: 0
<!--@include: @/examples/v0/guide/client/initClient/client.ts-->
```

Pour créer un client HTTP, il vous suffit d'utiliser la fonction `createHttpClient` de `@duplojs/http/clients`. 

Pour typer entièrement le client, il vous suffit de passer en générique un objet du type de `ServerRoute`.

::: tip 
Pour générer l'entièreté du typage d'un serveur `@duplojs/http`, il vous suffit d'utiliser le plugin [`code-generator`](/fr/v0/guide/plugins/codeGenerator).
:::
