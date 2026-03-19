---
description: "Gérer les entêtes Cache-Control"
prev:
  text: "Gestion CORS"
  link: "/fr/v0/guide/plugins/cors"
next:
  text: "FormData avancés"
  link: "/fr/v0/guide/features/formData"
---

# Contrôle du cache

`@duplojs/http/cacheController` fournit `createCacheControllerHooks`, un hook qui ajoute automatiquement l'entête [`Cache-Control`](https://developer.mozilla.org/fr/docs/Web/HTTP/Reference/Headers/Cache-Control) sur les réponses concernées.

Le hook n'ajoute l'entête que sur les réponses de statut `2xx` et `3xx`.

## Sur une route

```ts twoslash {2,12-16}
// @version: 0
<!--@include: @/examples/v0/guide/plugins/cacheController/route.ts-->
```

Dans ce cas, la configuration ne s'applique qu'à la route `GET /articles`.

- `public: true` autorise le cache partagé.
- `maxAge: 300` autorise un cache de 5 minutes.
- `staleWhileRevalidate: 60` permet de servir une réponse légèrement expirée pendant une revalidation.

## Sur toutes les routes du Hub

```ts twoslash {2,5-10}
// @version: 0
<!--@include: @/examples/v0/guide/plugins/cacheController/hub.ts-->
```

Ici, le hook est ajouté globalement avec `addRouteHooks`. Toutes les routes enregistrées dans ce `Hub` héritent donc de la même politique de cache.

## Interface de configuration

```ts
interface CacheControlDirectives {
	maxAge?: number;
	sMaxAge?: number;
	public?: true;
	private?: true | string[];
	noCache?: true | string[];
	noStore?: true;
	noTransform?: true;
	mustRevalidate?: true;
	proxyRevalidate?: true;
	immutable?: true;
	staleWhileRevalidate?: number;
	staleIfError?: number;
	mustUnderstand?: true;
	extensions?: Record<string, string>;
}
```

## Notes utiles

- `private` et `noCache` peuvent aussi recevoir une liste de noms d'entêtes.
- `extensions` permet d'ajouter des directives personnalisées si vous devez produire un header plus spécifique.
