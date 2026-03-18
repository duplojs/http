---
description: "Créer un point d'entrée static facilement"
prev:
  text: "Génération OpenAPI"
  link: "/fr/v0/guide/plugins/openApiGenerator"
next:
  text: "Gestion CORS"
  link: "/fr/v0/guide/plugins/cors"
---

# Créer un point d'entrée static

`@duplojs/http/static` permet d'exposer un fichier ou un dossier en lecture seule.
Vous pouvez soit brancher directement le `staticPlugin` dans le `Hub`, soit enregistrer une route manuellement avec `makeRouteFile` ou `makeRouteFolder`.

## Avec `staticPlugin`

```ts twoslash {3,9-22}
// @version: 0
<!--@include: @/examples/v0/guide/plugins/static/plugin.ts-->
```

Le plugin choisit automatiquement le bon comportement selon la source passée.

- `source` est un `FileInterface` ou un `FolderInterface`.
- `path` expose un fichier unique sur une route précise.
- `prefix` expose tout un dossier sous un préfixe d'URL.
- `cacheControlConfig` permet d'ajouter les entêtes `cache-control`.
- `directoryFallBackFile` permet de servir un fichier par défaut pour un dossier, par exemple `index.html`.

## Avec `makeRouteFile`

```ts twoslash {5-12}
// @version: 0
<!--@include: @/examples/v0/guide/plugins/static/makeRouteFile.ts-->
```

Utilisez cette fonction quand vous voulez enregistrer vous-même une route static pour un seul fichier.

- `source` désigne le fichier à servir.
- `path` est la route HTTP à exposer.
- `cacheControlConfig` est optionnel.

## Avec `makeRouteFolder`

```ts twoslash {5-13}
// @version: 0
<!--@include: @/examples/v0/guide/plugins/static/makeRouteFolder.ts-->
```

Cette version sert tous les fichiers d'un dossier à partir d'un préfixe commun.

- `source` désigne le dossier racine.
- `prefix` est le préfixe d'URL utilisé pour résoudre les fichiers.
- `directoryFallBackFile` permet de servir un fichier par défaut pour un dossier, par exemple `index.html`.
- `cacheControlConfig` est optionnel.
