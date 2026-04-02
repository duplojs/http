---
description: "Générer la config Swagger/OpenAPI avec openApiGenerator."
prev:
  text: "Génération de code"
  link: "/fr/v0/guide/plugins/codeGenerator"
next:
  text: "Fichiers static"
  link: "/fr/v0/guide/plugins/static"
---

# Génération OpenAPI
```ts twoslash {7-12}
// @version: 0
<!--@include: @/examples/v0/guide/plugins/openApiGenerator/hub.ts-->
```

Pour générer la configuration Swagger de toutes vos routes, il suffit d'utiliser la fonction `openApiGeneratorPlugin` de `@duplojs/http/openApiGenerator` dans le `Hub`, puis de démarrer avec la variable d'environnement définie sur `DEV` ou `BUILD`.

- Le paramètre `outputFile` vous permet de définir dans quel fichier sera écrite la configuration.
- Le paramètre `routePath` vous permet de définir à quel chemin l'interface Swagger UI sera accessible.
- `...` Le reste des paramètres permet de définir des options pour le fichier de configuration Swagger.

::: warning
Vous devez disposer d'une implémentation de serveur HTTP, car le plugin se branche sur le hook `beforeServerBuildRoutes`, qui ne se lance qu'au travers de fonctions d'interface comme `createHttpServer`. Démarrez avec un `Hub` configuré en mode `BUILD` pour éviter de lancer le serveur HTTP.
:::
