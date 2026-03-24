---
description: "Parser et sérialiser les cookies HTTP"
prev:
  text: "Contrôle du cache"
  link: "/fr/v0/guide/plugins/cacheController"
next:
  text: "FormData avancés"
  link: "/fr/v0/guide/features/formData"
---

# Gestion cookie

`@duplojs/http/cookie` permet de lire les cookies envoyés par le client et d'en renvoyer facilement dans les réponses.

Il est utile si vous voulez :

- récupérer une valeur depuis les cookies d'entrée
- poser un nouveau cookie dans une réponse
- demander au client de supprimer un cookie existant

## Avec `cookiePlugin`

```ts twoslash {2,7-9,22-24}
// @version: 0
<!--@include: @/examples/v0/guide/plugins/cookie/plugin.ts-->
```

Dans cet exemple :

- le plugin est branché une fois sur le `Hub`
- toutes les routes enregistrées dans ce `Hub` bénéficient alors du parsing d'entrée et de la sérialisation de sortie
- la route extrait directement `session` depuis `cookies`
- le handler renvoie aussi un nouveau cookie avec `setCookie`

Cette approche est la plus simple si le support des cookies doit être disponible partout dans votre application.

Vous pouvez aussi passer votre propre `parser` et votre propre `serializer` au plugin.
Cela permet par exemple de gérer des cookies signés, de centraliser une logique d'encodage particulière, ou d'adapter le format à une contrainte métier.

Si vous utilisez `cookiePlugin` globalement, vous pouvez exclure une route précise avec `IgnoreRouteCookieMetadata`.
Cela permet de garder le plugin activé partout, tout en retirant automatiquement les hooks cookie sur certaines routes.

## Avec les hooks directement sur une route

Sur une route, il existe trois façons de brancher les hooks cookie :

- laisser `cookiePlugin` les ajouter automatiquement
- ajouter `cookieHooks` pour récupérer le parsing d'entrée et la sérialisation de sortie d'un coup
- ajouter `parseRequestCookieHook` et `serializeResponseCookieHook` séparément si vous voulez un comportement plus ciblé

Si vous voulez brancher les deux comportements directement sur une route sans passer par le plugin, `cookieHooks` est la forme la plus simple.

```ts twoslash {2,6-9}
// @version: 0
<!--@include: @/examples/v0/guide/plugins/cookie/cookieHooks.ts-->
```

Ici, la route récupère le comportement standard du plugin, mais seulement pour elle.
C'est souvent la forme la plus pratique si vous voulez activer les cookies route par route.

## Avec les deux hooks séparés sur une route
```ts twoslash {2,5-12}
// @version: 0
<!--@include: @/examples/v0/guide/plugins/cookie/routeHooks.ts-->
```

Cette forme est la plus flexible.
Elle est utile si vous voulez n'ajouter qu'un seul hook, ou traiter séparément le parsing d'entrée et la sérialisation de sortie.
