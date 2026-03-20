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

```ts twoslash {2,7-9,23-27,31-33}
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

## Avec les hooks directement sur une route

```ts twoslash {2-7,11-18}
// @version: 0
<!--@include: @/examples/v0/guide/plugins/cookie/routeHooks.ts-->
```

Ici, le `Hub` n'est pas branché globalement avec `cookiePlugin`.
La route charge elle-même les hooks dont elle a besoin.

Cette forme est utile si vous voulez :

- limiter l'usage des cookies à quelques routes
- choisir vous-même quel parser ou quel serializer utiliser
- n'ajouter qu'un seul hook si nécessaire, par exemple uniquement le parsing d'entrée ou uniquement la sérialisation de sortie

Comme pour le plugin, chaque hook peut recevoir son propre parser ou son propre serializer.
C'est pratique si vous voulez réserver un comportement spécifique à une seule route, par exemple pour signer ou vérifier certains cookies sensibles.
