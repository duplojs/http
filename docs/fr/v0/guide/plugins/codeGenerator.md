---
description: "Générer le typage des routes avec codeGenerator."
prev:
  text: "Traiter une réponse"
  link: "/fr/v0/guide/client/handleResponse"
next:
  text: "Génération OpenAPI"
  link: "/fr/v0/guide/plugins/openApiGenerator"
---

# Génération de code
```ts twoslash {7}
// @version: 0
<!--@include: @/examples/v0/guide/plugins/codeGenerator/hub.ts-->
```

Pour générer le typage de toutes vos routes, il suffit d'utiliser la fonction `codeGeneratorPlugin` depuis `@duplojs/http/codeGenerator` dans le `Hub` et de démarrer avec la variable d'environnement sur `DEV` ou sur `BUILD`. 

Le paramètre `outputFile` vous permet de définir dans quel fichier sera écrit le code.

::: warning
Vous êtes obligé d'avoir une implémentation de serveur HTTP, car le plugin se lie au hook `beforeStartServer` qui se lance uniquement via des fonctions d'interfaçage comme `createHttpServer`. Lancez avec le `Hub` configuré en mode `BUILD` pour que le serveur HTTP ne se lance pas. 
:::

