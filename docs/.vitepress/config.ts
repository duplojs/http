import { defineConfig, type DefaultTheme, type UserConfig } from "vitepress";
import { transformerTwoslash } from "@shikijs/vitepress-twoslash";
import { ModuleDetectionKind, ModuleKind, ModuleResolutionKind } from "typescript";
import { groupIconMdPlugin, groupIconVitePlugin } from "vitepress-plugin-group-icons";
import { A, innerPipe, pipe, S, type AnyFunction } from "@duplojs/utils";
import { withMermaid } from "vitepress-plugin-mermaid";

const hostname = "https://http.duplojs.dev";
const ogImage = new URL("/images/ogImage.png", hostname).toString();

export default pipe(
	{
		title: "@duplojs/http",
		base: "/",
		cleanUrls: true,
		sitemap: {
			hostname,
		},
		head: [
			[
				"link",
				{
					rel: "icon",
					href: "/images/logo.ico",
				},
			],
			[
				"meta",
				{
					property: "og:type",
					content: "website",
				},
			],
			[
				"meta",
				{
					property: "og:image",
					content: ogImage,
				},
			],
			[
				"meta",
				{
					name: "twitter:card",
					content: "summary_large_image",
				},
			],
			[
				"meta",
				{
					name: "twitter:image",
					content: ogImage,
				},
			],
		],
		themeConfig: {
			logo: "/images/logo.png",
			wip: {
				title: "WIP",
				button: "Request this page",
			},
			socialLinks: [
				{
					icon: "github",
					link: "https://github.com/duplojs/http",
				},
				{
					icon: "npm",
					link: "https://www.npmjs.com/package/@duplojs/http",
				},
				{
					icon: "linkedin",
					link: "https://linkedin.com/company/duplojs",
				},
				{
					icon: "discord",
					link: "https://discord.gg/5d6Ze5Wuqm",
				},
			],
			search: {
				provider: "local",
			},
		},
		markdown: {
			config: (md) => {
				md.use(groupIconMdPlugin);
			},
			codeTransformers: [
				{
					name: "duplo-version-transformer",
					preprocess: innerPipe(
						S.replace(
							/\/\/ @version: (?<version>[0-9]+)/,
							({ namedGroups }) => A.join(
								[
									"// @filename: @duplojs/http.ts",
									`export * from "@v${namedGroups?.version ?? ""}";`,

									"// @filename: @duplojs/http/client.ts",
									`export * from "@v${namedGroups?.version ?? ""}/client";`,

									"// @filename: @duplojs/http/node.ts",
									`export * from "@v${namedGroups?.version ?? ""}/node";`,

									"// @filename: @duplojs/http/codeGenerator.ts",
									`export * from "@v${namedGroups?.version ?? ""}/codeGenerator";`,

									"// @filename: @duplojs/http/openApiGenerator.ts",
									`export * from "@v${namedGroups?.version ?? ""}/openApiGenerator";`,

									"// @filename: @duplojs/http/static.ts",
									`export * from "@v${namedGroups?.version ?? ""}/static";`,

									"// @filename: @duplojs/http/cors.ts",
									`export * from "@v${namedGroups?.version ?? ""}/cors";`,

									"// @filename: @duplojs/http/cacheController.ts",
									`export * from "@v${namedGroups?.version ?? ""}/cacheController";`,

									"// @filename: @duplojs/http/cookie.ts",
									`export * from "@v${namedGroups?.version ?? ""}/cookie";`,

									"// @filename: index.ts",
									"// ---cut---",
								],
								"\n",
							),
						),
						S.replace(
							/ ?@ts-expect-error/g,
							"",
						),
					),
				},
				transformerTwoslash({
					twoslashOptions: {
						compilerOptions: {
							module: ModuleKind.ESNext,
							moduleResolution: ModuleResolutionKind.Bundler,
							moduleDetection: ModuleDetectionKind.Force,
							strict: true,
							noImplicitAny: true,
							strictNullChecks: true,
							strictFunctionTypes: true,
							strictBindCallApply: true,
							strictPropertyInitialization: true,
							noImplicitThis: true,
							useUnknownInCatchVariables: true,
							alwaysStrict: true,
							noImplicitReturns: true,
							noUncheckedIndexedAccess: true,
							noImplicitOverride: true,
							types: ["@types/web"],
							paths: {
								"@v0": ["libs/v0/core/index"],
								"@v0/client": ["libs/v0/client/index"],
								"@v0/node": ["libs/v0/interfaces/node/index"],
								"@v0/codeGenerator": ["libs/v0/plugins/codeGenerator/index"],
								"@v0/openApiGenerator": ["libs/v0/plugins/openApiGenerator/index"],
								"@v0/static": ["libs/v0/plugins/static/index"],
								"@v0/cors": ["libs/v0/plugins/cors/index"],
								"@v0/cacheController": ["libs/v0/plugins/cacheController/index"],
								"@v0/cookie": ["libs/v0/plugins/cookie/index"],
							},
						},
					},
				}),
			],
			languages: ["js", "jsx", "ts", "tsx"],
		},
		vite: {
			plugins: [groupIconVitePlugin()],
		},
		locales: {
			fr: {
				description: "Créer et consommer des serveurs HTTP de manière robuste, avec une excellente expérience développeur.",
				label: "Français",
				lang: "fr",
				link: "/fr/",
				themeConfig: {
					wip: {
						title: "WIP",
						button: "Demander la création de cette page",
					},
					nav: [
						{
							text: "Guide",
							link: "/fr/v0/guide/",
						},
						{
							text: "API",
							items: [
								{
									text: "Core",
									link: "/fr/v0/api/core/",
								},
								{
									text: "Client",
									link: "/fr/v0/api/client/",
								},
								{
									text: "Interfaces",
									link: "/fr/v0/api/interfaces/",
								},
								{
									text: "Plugins",
									link: "/fr/v0/api/plugins/",
								},
							],
						},
						{
							text: "v0.x (LTS)",
							items: [
								{
									text: "v0.x (LTS)",
									link: "/fr/v0/guide/",
								},
							],
						},
					],
					docFooter: {
						prev: "Page précédente",
						next: "Page suivante",
					},
					sidebar: {
						"/fr/v0/guide/": [
							{
								text: "Commencer",
								items: [
									{
										text: "Introduction",
										link: "/fr/v0/guide/",
									},
									{
										text: "Démarrage rapide",
										link: "/fr/v0/guide/quickStart",
									},
									{
										text: "Serveur",
										items: [
											{
												text: "Créer un hub",
												link: "/fr/v0/guide/server/createHub",
											},
											{
												text: "Démarrer un serveur",
												link: "/fr/v0/guide/server/startServer",
											},
											{
												text: "Créer sa première route",
												link: "/fr/v0/guide/server/firstRoute",
											},
											{
												text: "Récupérer des données",
												link: "/fr/v0/guide/server/getData",
											},
											{
												text: "Faire une vérification",
												link: "/fr/v0/guide/server/doCheck",
											},
											{
												text: "Faire une routine de vérification",
												link: "/fr/v0/guide/server/doCheckRoutine",
											},
										],
									},
									{
										text: "Client",
										items: [
											{
												text: "Initialiser un client",
												link: "/fr/v0/guide/client/initClient",
											},
											{
												text: "Faire une requête",
												link: "/fr/v0/guide/client/doRequest",
											},
											{
												text: "Traiter une réponse",
												link: "/fr/v0/guide/client/handleResponse",
											},
											{
												text: "Cache client",
												link: "/fr/v0/guide/client/clientCache",
											},
										],
									},
									{
										text: "Plugins",
										items: [
											{
												text: "Génération de code",
												link: "/fr/v0/guide/plugins/codeGenerator",
											},
											{
												text: "Génération OpenAPI",
												link: "/fr/v0/guide/plugins/openApiGenerator",
											},
											{
												text: "Fichiers static",
												link: "/fr/v0/guide/plugins/static",
											},
											{
												text: "Gestion CORS",
												link: "/fr/v0/guide/plugins/cors",
											},
											{
												text: "Contrôle du cache",
												link: "/fr/v0/guide/plugins/cacheController",
											},
											{
												text: "Gestion Cookie",
												link: "/fr/v0/guide/plugins/cookie",
											},
										],
									},
									{
										text: "Features",
										items: [
											{
												text: "FormData avancés",
												link: "/fr/v0/guide/features/formData",
											},
											{
												text: "Server-Sent Events (SSE)",
												link: "/fr/v0/guide/features/SSE",
											},
											{
												text: "Stream",
												link: "/fr/v0/guide/features/stream",
											},
										],
									},
								],
							},
						],
					},
					outline: { label: "Sur cette page" },
					returnToTopLabel: "Retour en haut",
					darkModeSwitchLabel: "Mode sombre",
					footer: {
						copyright: "Copyright © 2025-présent Contributeurs de DuploJS",
						message: "Diffusé sous licence MIT.",
					},
				},
			},
			root: {
				description: "Build and consume HTTP servers robustly with an excellent developer experience.",
				label: "English",
				lang: "en",
				link: "/en/",
				themeConfig: {
					nav: [
						{
							text: "Guide",
							link: "/en/v0/guide/",
						},
						{
							text: "API",
							items: [
								{
									text: "Core",
									link: "/en/v0/api/core/",
								},
								{
									text: "Client",
									link: "/en/v0/api/client/",
								},
								{
									text: "Interfaces",
									link: "/en/v0/api/interfaces/",
								},
								{
									text: "Plugins",
									link: "/en/v0/api/plugins/",
								},
							],
						},
						{
							text: "v0.x (LTS)",
							items: [
								{
									text: "v0.x (LTS)",
									link: "/en/v0/guide/",
								},
							],
						},
					],
					docFooter: {
						prev: "Previous page",
						next: "Next page",
					},
					sidebar: {
						"/en/v0/guide/": [
							{
								text: "Get started",
								items: [
									{
										text: "Introduction",
										link: "/en/v0/guide/",
									},
									{
										text: "Quick start",
										link: "/en/v0/guide/quickStart",
									},
									{
										text: "Server",
										items: [
											{
												text: "Create a hub",
												link: "/en/v0/guide/server/createHub",
											},
											{
												text: "Start a server",
												link: "/en/v0/guide/server/startServer",
											},
											{
												text: "Create your first route",
												link: "/en/v0/guide/server/firstRoute",
											},
											{
												text: "Get data",
												link: "/en/v0/guide/server/getData",
											},
											{
												text: "Run a check",
												link: "/en/v0/guide/server/doCheck",
											},
											{
												text: "Build a check routine",
												link: "/en/v0/guide/server/doCheckRoutine",
											},
										],
									},
									{
										text: "Client",
										items: [
											{
												text: "Initialize a client",
												link: "/en/v0/guide/client/initClient",
											},
											{
												text: "Make a request",
												link: "/en/v0/guide/client/doRequest",
											},
											{
												text: "Handle a response",
												link: "/en/v0/guide/client/handleResponse",
											},
											{
												text: "Client cache",
												link: "/en/v0/guide/client/clientCache",
											},
										],
									},
									{
										text: "Plugins",
										items: [
											{
												text: "Code generation",
												link: "/en/v0/guide/plugins/codeGenerator",
											},
											{
												text: "OpenAPI generation",
												link: "/en/v0/guide/plugins/openApiGenerator",
											},
											{
												text: "Static Files",
												link: "/en/v0/guide/plugins/static",
											},
											{
												text: "CORS Management",
												link: "/en/v0/guide/plugins/cors",
											},
											{
												text: "Cache Control",
												link: "/en/v0/guide/plugins/cacheController",
											},
											{
												text: "Cookie Management",
												link: "/en/v0/guide/plugins/cookie",
											},
										],
									},
									{
										text: "Features",
										items: [
											{
												text: "Advanced FormData",
												link: "/en/v0/guide/features/formData",
											},
											{
												text: "Server-Sent Events (SSE)",
												link: "/en/v0/guide/features/SSE",
											},
											{
												text: "Stream",
												link: "/en/v0/guide/features/stream",
											},
										],
									},
								],
							},
						],
					},
					outline: { label: "On this page" },
					returnToTopLabel: "Return to top",
					darkModeSwitchLabel: "Dark mode",
					footer: {
						copyright: "Copyright © 2025-present DuploJS contributors",
						message: "Released under the MIT License.",
					},
				},
			},
		},
	} satisfies UserConfig<DefaultTheme.Config>,
	defineConfig,
	// wait vitepress v2 compatibility,
	withMermaid as AnyFunction,
);
