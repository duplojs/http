---
description: "Gérer des flux applicatifs binaires et textuels."
prev:
  text: "Server-Sent Events (SSE)"
  link: "/fr/v0/guide/features/SSE"
next:
  text: ""
  link: ""
---

# Stream
Vous pouvez renvoyer un flux applicatif continu avec `ResponseContract.stream` pour des chunks binaires, ou `ResponseContract.streamText` pour des chunks texte.

```ts twoslash
// @version: 0
<!--@include: @/examples/v0/guide/features/stream/route.ts-->
```

`stream` est adapté quand vous voulez pousser des chunks opaques côté client. `streamText` est plus pratique quand vous voulez consommer directement des chaînes.

## Consommer le flux côté client
Le client détecte automatiquement ce type de réponse et retourne un objet itérable enrichi avec des hooks `onStream`.

```ts twoslash
// @version: 0
// @filename: types.ts
<!--@include: @/examples/v0/guide/features/stream/types.d.ts-->
// @filename: main.ts
// ---cut---
<!--@include: @/examples/v0/guide/features/stream/client.ts-->
```

Pour consommer le flux, vous pouvez soit itérer sur la réponse avec `for await...of`, soit appeler `consumeStream()`. L'événement `receiveData` reçoit le type de chunk adapté au contrat client généré.
