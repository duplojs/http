---
description: ""
prev:
  text: "Introduction"
  link: "/en/v0/guide/"
next:
  text: "Create a hub"
  link: "/en/v0/guide/server/createHub"
---

# Quick start

## Install dependencies
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

### Development dependencies
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

## Configure package.json
```json
{
	...,
	"type": "module", // Strongly recommended
	...,
}
```

## TypeScript configuration
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

## Create `src/routes/helloWorld.ts`

```ts twoslash
// @version: 0
<!--@include: @/examples/v0/guide/quickStart/routes/helloWorld.ts-->
```

## Create `src/main.ts`

```ts twoslash
// @version: 0
<!--@include: @/examples/v0/guide/quickStart/main.ts-->
```

## Start the HTTP server

```bash
npx tsx --watch src/main.ts
```

## Use the client

```ts twoslash
// @version: 0
// @filename: types.ts
<!--@include: @/examples/v0/guide/quickStart/types.d.ts-->
// @filename: main.ts
// ---cut---
<!--@include: @/examples/v0/guide/quickStart/client.ts-->
```
