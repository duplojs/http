---
description: "Gérer les entêtes CORS"
prev:
  text: "Créer un point d'entrée static"
  link: "/fr/v0/guide/plugins/static"
next:
  text: "Contrôle du cache"
  link: "/fr/v0/guide/plugins/cacheController"
---

# Gestion CORS

`@duplojs/http/cors` ajoute automatiquement les entêtes [CORS](https://developer.mozilla.org/fr/docs/Web/HTTP/Guides/CORS) sur les réponses classiques et crée une route `OPTIONS /*` pour répondre aux [preflight request](https://developer.mozilla.org/fr/docs/Web/HTTP/Guides/CORS#aper%C3%A7u_fonctionnel).

## Exemple complet

```ts twoslash {2,6-16}
// @version: 0
<!--@include: @/examples/v0/guide/plugins/cors/plugin.ts-->
```

Dans cet exemple :

- `allowOrigin` limite les origines autorisées.
- `allowHeaders` déclare les [entêtes HTTP](https://developer.mozilla.org/fr/docs/Web/HTTP/Reference/Headers) acceptés pendant la pré-vérification.
- `exposeHeaders` rend certains entêtes lisibles côté navigateur.
- `allowMethods: true` génère automatiquement `access-control-allow-methods` à partir des routes enregistrées dans le `Hub`.
- `credentials: true` ajoute `access-control-allow-credentials: true` pour les [credentials](https://developer.mozilla.org/fr/docs/Web/HTTP/Guides/CORS#requ%C3%AAtes_n%C3%A9cessitant_une_pr%C3%A9-v%C3%A9rification).
- `maxAge` définit la durée de cache de la pré-vérification en secondes.

## Interface des paramètres

```ts
interface CorsPluginParams {
	readonly allowOrigin?:
		| string
		| RegExp
		| readonly string[]
		| ((origin: string) => boolean | Promise<boolean>)
		| true;
	readonly allowHeaders?: string | readonly string[] | true;
	readonly exposeHeaders?: string | readonly string[];
	readonly maxAge?: number;
	readonly credentials?: boolean;
	readonly allowMethods?: RequestMethods | readonly RequestMethods[] | true;
}
```

Il faut fournir au moins une option au plugin.

## Détail des options

- `allowOrigin` accepte une origine unique, une liste, une expression régulière, une fonction de validation, ou `true` pour autoriser toutes les origines.
- `allowHeaders` accepte une chaîne, une liste, ou `true` pour tous les headers.
- `exposeHeaders` liste les entêtes que le navigateur pourra lire après la requête.
- `allowMethods` accepte une méthode, une liste, ou `true` pour calculer automatiquement les méthodes autorisées par chemin.
- `credentials` active le partage des cookies et autres identifiants d'authentification.
- `maxAge` contrôle la mise en cache de la réponse `OPTIONS`.
