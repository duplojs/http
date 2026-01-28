---
description: ""
prev:
  text: "Génération de code"
  link: "/fr/v0/guide/plugins/codeGenerator"
next:
  text: ""
  link: ""
---

# Génération OpenAPI
```ts twoslash {7-12}
// @version: 0
<!--@include: @/examples/v0/guide/plugins/openApiGenerator/hub.ts-->
```

Pour générer la configuration Swagger de toutes vos routes, il suffit d'utiliser la fonction `openApiGeneratorPlugin` depuis `@duplojs/http/openApiGenerator` dans le `Hub` et de démarrer avec la variable d'environnement sur `DEV` ou sur `BUILD`. 

- Le paramètre `outputFile` vous permet de définir dans quel fichier sera écrite la configuration.
- Le paramètre `routePath` vous permet de définir sur quel path vous pouvez accéder à l'UI Swagger.
- `...` Le reste des paramètres permet de définir des options sur le fichier de configuration Swagger. 

::: warning
Vous êtes obligé d'avoir une implémentation de serveur HTTP, car le plugin se lie au hook `beforeServerBuildRoutes` qui se lance uniquement via des fonctions d'interfaçage comme `createHttpServer`. Lancez avec le `Hub` configuré en mode `BUILD` pour que le serveur HTTP ne se lance pas. 
:::
