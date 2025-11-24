import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import tscAlias from 'rollup-plugin-tsc-alias';
import { defineConfig } from "rollup";

export default defineConfig([
	{
		input: "scripts/interfaces/node/index.ts",
		output: [
			{
				dir: "dist",
				format: "esm",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].mjs"
			},
			{
				dir: "dist",
				format: "cjs",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].cjs"
			},
		],
		plugins: [
			del({ targets: "dist" }),
			typescript({ tsconfig: "scripts/interfaces/node/tsconfig.build.json" }),
			tscAlias({ configFile: "scripts/interfaces/node/tsconfig.build.json" }),
		],
	},
	{
		input: "scripts/interfaces/bun/index.ts",
		output: [
			{
				dir: "dist",
				format: "esm",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].mjs"
			},
			{
				dir: "dist",
				format: "cjs",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].cjs"
			},
		],
		plugins: [
			typescript({ tsconfig: "scripts/interfaces/bun/tsconfig.build.json" }),
			tscAlias({ configFile: "scripts/interfaces/bun/tsconfig.build.json" }),
		],
	},
	{
		input: "scripts/interfaces/deno/index.ts",
		output: [
			{
				dir: "dist",
				format: "esm",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].mjs"
			},
			{
				dir: "dist",
				format: "cjs",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].cjs"
			},
		],
		plugins: [
			typescript({ tsconfig: "scripts/interfaces/deno/tsconfig.build.json" }),
			tscAlias({ configFile: "scripts/interfaces/deno/tsconfig.build.json" }),
		],
	},
	{
		input: "scripts/core/index.ts",
		output: [
			{
				dir: "dist",
				format: "esm",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].mjs"
			},
			{
				dir: "dist",
				format: "cjs",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].cjs"
			},
		],
		plugins: [
			typescript({ tsconfig: "scripts/core/tsconfig.build.json" }),
			tscAlias({ configFile: "scripts/core/tsconfig.build.json" }),
		],
	},
]);
