import { defineConfig, type DefaultTheme, type UserConfig } from "vitepress";
import { transformerTwoslash } from "@shikijs/vitepress-twoslash";
import { ModuleDetectionKind, ModuleKind, ModuleResolutionKind } from "typescript";
import { groupIconMdPlugin, groupIconVitePlugin } from "vitepress-plugin-group-icons";
import { A, innerPipe, pipe, pipeCall, S, type AnyFunction } from "@duplojs/utils";
import { withMermaid } from "vitepress-plugin-mermaid";

export default pipe(
	{
		title: "@duplojs/http",
		description: "A VitePress Site",
		themeConfig: {
			logo: "/images/logo.png",

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
							paths: {
								"@v0": ["libs/v0/core/index"],
								"@v0/client": ["libs/v0/client/index"],
								"@v0/node": ["libs/v0/interfaces/node/index"],
								"@v0/codeGenerator": ["libs/v0/plugins/codeGenerator/index"],
								"@v0/openApiGenerator": ["libs/v0/plugins/openApiGenerator/index"],
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
				description: "Créer et consulter des serveur HTTP de manier robuste et avec excellente expérience développeur.",
				label: "Français",
				lang: "fr",
				link: "/fr/",
				themeConfig: {
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
										],
									},
									{
										text: "Plugins",
										items: [
											{
												text: "Generation de code",
												link: "/fr/v0/guide/plugins/codeGenerator",
											},
											{
												text: "Generation open API",
												link: "/fr/v0/guide/plugins/openApiGenerator",
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
				description: "",
				label: "English",
				lang: "en",
				link: "/en/",
				themeConfig: {

				},
			},
		},
	} satisfies UserConfig<DefaultTheme.Config>,
	defineConfig,
	// wait vitepress v2 compatibility,
	withMermaid as AnyFunction,
);
