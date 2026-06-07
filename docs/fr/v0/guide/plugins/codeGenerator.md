---
description: "Générer le typage des routes avec codeGenerator."
prev:
  text: "Cache client"
  link: "/fr/v0/guide/client/clientCache"
next:
  text: "Génération OpenAPI"
  link: "/fr/v0/guide/plugins/openApiGenerator"
---

# Génération de code
```ts twoslash {7}
// @version: 0
<!--@include: @/examples/v0/guide/plugins/codeGenerator/hub.ts-->
```

Pour générer le typage de toutes vos routes, utilisez la fonction `codeGeneratorPlugin` depuis `@duplojs/http/codeGenerator` dans le `Hub`, puis démarrez avec la variable d'environnement définie sur `DEV` ou `BUILD`.

- Le paramètre `outputFile` permet de définir le fichier dans lequel le typage des routes sera écrit.
- Le paramètre `generateDataParser.outputFolder` définit le dossier dans lequel les data parsers identifiés seront générés.
- Le paramètre `generateDataParser.disabledFromRoute` désactive la génération de data parsers à partir des routes.
- Le paramètre `generateDataParser.dataParsers` permet de fournir une liste de data parsers à générer. Dans ce cas, seuls les data parsers identifiés seront générés.

::: warning
Vous devez disposer d'une implémentation de serveur HTTP, car le plugin s'attache au hook `beforeStartServer`, qui n'est exécuté que via des fonctions d'interfaçage comme `createHttpServer`. Lancez avec un `Hub` configuré en mode `BUILD` pour éviter de démarrer le serveur HTTP.
:::
