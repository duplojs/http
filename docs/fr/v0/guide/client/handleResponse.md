---
description: ""
prev:
  text: "Faire une requête"
  link: "/fr/v0/guide/client/doRequest"
next:
  text: "Génération de code"
  link: "/fr/v0/guide/plugins/codeGenerator"
---

# Traiter une réponse

```ts twoslash
// @version: 0
// @filename: types.ts
<!--@include: @/examples/v0/guide/client/handleResponse/types.d.ts-->
// @filename: main.ts
// ---cut---
<!--@include: @/examples/v0/guide/client/handleResponse/client.ts-->
```

L'objet retourné par les méthodes `get`, `post`, `patch`, `put`, `delete` ou `request` s'appelle `PromiseRequest`. Cet objet a plein de méthodes pour traiter les réponses en fonction du besoin :
- Les méthodes commençant par `when` sont de simples callbacks en fonction de leur configuration.
- Les méthodes commençant par `iWant` sont des promesses qui renvoient un `Either` du résultat demandé.
- Les méthodes finissant par `OrThrow` renvoient uniquement le bon résultat, mais émettent une erreur au cas contraire.

::: info 
L'objet `PromiseRequest` ne peut pas émettre d'erreur. Par défaut, il renverra toujours un `Either`.
:::
