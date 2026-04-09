---
description: "Gérer des flux Server-Sent Events (SSE) de manière robuste."
prev:
  text: "FormData avancés"
  link: "/fr/v0/guide/features/formData"
next:
  text: "Stream"
  link: "/fr/v0/guide/features/stream"
---

# Server-Sent Events (SSE)
Vous pouvez gérer un flux `SSE` en utilisant le contrat de réponse approprié.

```ts twoslash
// @version: 0
<!--@include: @/examples/v0/guide/features/SSE/route.ts-->
```

## Gestion du flux côté client
Il suffit d'appeler une route qui renvoie un flux `SSE`, et le client se chargera de créer une réponse adaptée pour le recevoir.

```ts twoslash
// @version: 0
// @filename: types.ts
<!--@include: @/examples/v0/guide/features/SSE/types.d.ts-->
// @filename: main.ts
// ---cut---
<!--@include: @/examples/v0/guide/features/SSE/client.ts-->
```

Lorsque le client détecte un flux `SSE`, il ajoute des méthodes permettant de manipuler et de consommer les événements reçus. Pour consommer le flux, il suffit soit d'itérer sur la réponse, soit d'appeler la méthode `consumeEventStream`.
