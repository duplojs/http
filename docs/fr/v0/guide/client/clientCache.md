---
description: "Mettre en cache les réponses du client HTTP côté navigateur ou runtime."
prev:
  text: "Traiter une réponse"
  link: "/fr/v0/guide/client/handleResponse"
next:
  text: "Génération de code"
  link: "/fr/v0/guide/plugins/codeGenerator"
---

# Cache client

```ts twoslash
// @version: 0
// @filename: types.ts
<!--@include: @/examples/v0/guide/client/clientCache/types.d.ts-->
// @filename: main.ts
// ---cut---
<!--@include: @/examples/v0/guide/client/clientCache/client.ts-->
```

Le client HTTP peut mettre en cache les réponses côté client. Pour activer ce comportement sur une requête, il faut utiliser la prop `clientCache`.

Avec la valeur `"auto"`, DuploJS construit une clé de cache à partir de :
- la méthode HTTP
- le path final avec les params injectés
- la query triée par clé
- le body

Vous pouvez aussi passer une fonction pour construire votre propre clé de cache.

Seules les réponses `2xx` sont enregistrées dans le cache. Lorsqu'une réponse vient du cache, la propriété `fromCache` est définie à `true`.

Deux options permettent de contrôler ce comportement :
- `bypassClientCache: true` ignore complètement le cache pour la requête courante : aucune lecture et aucune écriture.
- `refreshClientCache: true` ignore uniquement la lecture du cache, refait la requête réseau, puis remplace la valeur en cache si la réponse est un succès.

::: info
Le cache client est local à l'instance de `createHttpClient`. Deux clients différents ne partagent pas le même cache.
:::
