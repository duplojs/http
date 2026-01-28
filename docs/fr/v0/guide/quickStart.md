---
description: ""
prev:
  text: "Introduction"
  link: "/fr/v0/guide/"
next:
  text: "Créer un hub"
  link: "/fr/v0/guide/server/createHub"
---

# Démarrage rapide

## Installation des dépendances
::: code-group
```bash [npm]
npm install @duplojs/http@0 @duplojs/utils@1
```
```bash [yarn]
yarn add @duplojs/http@0 @duplojs/utils@1
```
```bash [pnpm]
pnpm add @duplojs/http@0 @duplojs/utils@1
```
:::

### Dépendances de développement
::: code-group
```bash [npm]
npm install typescript@>=5.9 tsx@>=4.21 --save-dev
```
```bash [yarn]
yarn add typescript@>=5.9 tsx@>=4.21 --dev
```
```bash [pnpm]
pnpm add typescript@>=5.9 tsx@>=4.21 --dev
```
:::

## Configuration du package.json
```json
{
	...,
	"type": "module", // Fortement conseillé
	...,
}
```

## Configuration typescript
```json
{
	"compilerOptions": {
		"target": "ESNext",
		"lib": ["ESNext"],
		"moduleDetection": "force",
		"module": "ESNext",
		"moduleResolution": "Bundler",
		"noEmit": true,
		"isolatedModules": true,
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"strict": true,
		"noImplicitAny": true,
		"strictNullChecks": true,
		"strictFunctionTypes": true,
		"strictBindCallApply": true,
		"strictPropertyInitialization": true,
		"noImplicitThis": true,
		"useUnknownInCatchVariables": true,
		"alwaysStrict": true,
		"noImplicitReturns": true,
		"noUncheckedIndexedAccess": true,
		"noImplicitOverride": true,
		"skipLibCheck": true,
	},
	"include": ["src/**/*.ts"],
}
```

## Créer le fichier `src/routes/helloWorld.ts`

```ts twoslash
// @version: 0
<!--@include: @/examples/v0/guide/quickStart/routes/helloWorld.ts-->
```

## Créer le fichier `src/main.ts`

```ts twoslash
// @version: 0
<!--@include: @/examples/v0/guide/quickStart/main.ts-->
```

## Lancer le serveur HTTP

```bash
npx tsx --watch src/main.ts
```

## Utiliser le client

```ts twoslash
// @version: 0
// @filename: types.ts
<!--@include: @/examples/v0/guide/quickStart/types.d.ts-->
// @filename: main.ts
// ---cut---
<!--@include: @/examples/v0/guide/quickStart/client.ts-->
```
