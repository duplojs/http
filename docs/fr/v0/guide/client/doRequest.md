---
description: "Envoyer des requêtes avec le client HTTP et ses méthodes."
prev:
  text: "Initialiser un client"
  link: "/fr/v0/guide/client/initClient"
next:
  text: "Traiter une réponse"
  link: "/fr/v0/guide/client/handleResponse"
---

# Faire une requête

```ts twoslash
// @version: 0
// @filename: types.ts
<!--@include: @/examples/v0/guide/client/doRequest/types.d.ts-->
// @filename: main.ts
// ---cut---
<!--@include: @/examples/v0/guide/client/doRequest/client.ts-->
```

Pour faire une requête, il vous suffit d'appeler les méthodes `get`, `post`, `patch`, `put`, `delete` ou `request` du client HTTP. Ces méthodes-là vous renvoient une `PromiseRequest`, qui est un objet étendu de Promise. 

Si vous avez initialisé votre client avec du typage, celui-ci vous proposera les paths et paramètres disponibles pour chacune des routes. Plus de possibilité de se tromper !
