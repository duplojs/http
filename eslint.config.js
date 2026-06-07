import {duplojsEslintOpen, duplojsEslintTest} from "@duplojs/eslint";

export default [
	{
		...duplojsEslintTest,
		languageOptions: {
			...duplojsEslintTest.languageOptions,
			parserOptions: {
				...duplojsEslintTest.languageOptions.parserOptions,
				projectService: true,
			},
		},
		files: ["**/*.test.ts", "test/**/*.ts"],
		ignores: ["**/*.d.ts"]
	},
	{
		...duplojsEslintOpen,
		languageOptions: {
			...duplojsEslintOpen.languageOptions,
			parserOptions: {
				...duplojsEslintOpen.languageOptions.parserOptions,
				projectService: true,
			},
		},
		files: ["**/*.ts"],
		ignores: ["**/*.test.ts", "test/**/*.ts", "**/*.d.ts"],
	},
	{
		rules: {
			"@stylistic/js/no-multiple-empty-lines": "off",
			"@typescript-eslint/no-confusing-void-expression": "off",
			"no-nested-ternary": "off",
			"@stylistic/js/line-comment-position": "off",
			"@typescript-eslint/consistent-type-definitions": "off",
		},
		files: ["docs/examples/**/*.ts"],
	},
	{
		ignores: ["coverage", "dist", "**/*.generate.*", "**/*.generate", "docs/libs/*", "docs/.vitepress/cache/*", "docs/.vitepress/dist/*", "**/*.d.ts"]
	}
];
