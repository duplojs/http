import { defineConfig } from "oxlint";
import { openConfig, testPreset } from "@duplojs/code-config/oxlint";

export default defineConfig({
	extends: [openConfig],
	options: {
		...openConfig.options,
		typeAware: true,
		typeCheck: true,
	},
	overrides: [
		{
			files: [
				"**/*.test.ts",
				"**/*.bench.ts",
				"integrations/**/*.ts",
				"tests/**/*.ts",
			],
			excludeFiles: ["**/*.d.ts"],
			rules: {
				...testPreset.rules,
				"typescript/no-confusing-void-expression": "off",
			},
		},
		{
			files: ["docs/examples/**/*.ts"],
			rules: {
				"@stylistic/no-multiple-empty-lines": "off",
				"typescript/no-confusing-void-expression": "off",
				"no-nested-ternary": "off",
				"@stylistic/line-comment-position": "off",
				"typescript/consistent-type-definitions": "off",
			},
		},
	],
	ignorePatterns: [
		"coverage/**",
		"dist/**",
		".commands/**",
		".agents/**",
		"docs/public/*",
		"docs/libs/*",
		"docs/.vitepress/cache/*",
		"docs/.vitepress/dist/*",
		"**/*.generate.*",
		"**/*.generate",
		"**/*.d.ts",
	],
});
