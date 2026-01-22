import { defineConfig } from "vitepress";
import { transformerTwoslash } from "@shikijs/vitepress-twoslash";
import { ModuleDetectionKind, ModuleKind, ModuleResolutionKind } from "typescript";
import { groupIconMdPlugin, groupIconVitePlugin } from "vitepress-plugin-group-icons";
import { A, innerPipe, S } from "@duplojs/utils";

export default defineConfig({
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
});
