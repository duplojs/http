import { defineConfig } from "rolldown";
import del from "rollup-plugin-delete";
import dts from "unplugin-dts/rolldown";

const external = [
	/^@duplojs\/utils/,
	/^@duplojs\/server-utils/,
	/^@duplojs\/data-parser-tools/,
	/^@duplojs\/lang/,
	/^node:/,
	"http",
	"https",
];

export default defineConfig([
	// plugins
	{
		input: "scripts/plugins/openApiGenerator/index.ts",
		platform: "node",
		external,
		tsconfig: "scripts/plugins/openApiGenerator/tsconfig.build.json",
		output: [
			{
				dir: "dist",
				format: "esm",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].mjs",
			},
			{
				dir: "dist",
				format: "cjs",
				exports: "named",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].cjs",
			},
		],
		treeshake: false,
		plugins: [
			del({
				targets: "dist/plugins/openApiGenerator",
				runOnce: true,
			}),
			dts({
				tsconfigPath: "scripts/plugins/openApiGenerator/tsconfig.build.json",
				outDirs: "dist",
				bundleTypes: false,
				entryRoot: "scripts",
				compilerOptions: {
					rootDir: "scripts",
					types: ["node", "web"],
				},
			}),
		],
	},
	{
		input: "scripts/plugins/codeGenerator/index.ts",
		platform: "node",
		external,
		tsconfig: "scripts/plugins/codeGenerator/tsconfig.build.json",
		output: [
			{
				dir: "dist",
				format: "esm",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].mjs",
			},
			{
				dir: "dist",
				format: "cjs",
				exports: "named",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].cjs",
			},
		],
		treeshake: false,
		plugins: [
			del({
				targets: "dist/plugins/codeGenerator",
				runOnce: true,
			}),
			dts({
				tsconfigPath: "scripts/plugins/codeGenerator/tsconfig.build.json",
				outDirs: "dist",
				bundleTypes: false,
				entryRoot: "scripts",
				compilerOptions: {
					rootDir: "scripts",
					types: ["node", "web"],
				},
			}),
		],
	},
	{
		input: "scripts/plugins/static/index.ts",
		platform: "node",
		external,
		tsconfig: "scripts/plugins/static/tsconfig.build.json",
		output: [
			{
				dir: "dist",
				format: "esm",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].mjs",
			},
			{
				dir: "dist",
				format: "cjs",
				exports: "named",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].cjs",
			},
		],
		treeshake: false,
		plugins: [
			del({
				targets: "dist/plugins/static",
				runOnce: true,
			}),
			dts({
				tsconfigPath: "scripts/plugins/static/tsconfig.build.json",
				outDirs: "dist",
				bundleTypes: false,
				entryRoot: "scripts",
				compilerOptions: {
					rootDir: "scripts",
					types: ["node", "web"],
				},
			}),
		],
	},
	{
		input: "scripts/plugins/cacheController/index.ts",
		platform: "neutral",
		external,
		tsconfig: "scripts/plugins/cacheController/tsconfig.build.json",
		output: [
			{
				dir: "dist",
				format: "esm",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].mjs",
			},
			{
				dir: "dist",
				format: "cjs",
				exports: "named",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].cjs",
			},
		],
		treeshake: false,
		plugins: [
			del({
				targets: "dist/plugins/cacheController",
				runOnce: true,
			}),
			dts({
				tsconfigPath: "scripts/plugins/cacheController/tsconfig.build.json",
				outDirs: "dist",
				bundleTypes: false,
				entryRoot: "scripts",
				compilerOptions: {
					rootDir: "scripts",
					types: ["node", "web"],
				},
			}),
		],
	},
	{
		input: "scripts/plugins/cors/index.ts",
		platform: "neutral",
		external,
		tsconfig: "scripts/plugins/cors/tsconfig.build.json",
		output: [
			{
				dir: "dist",
				format: "esm",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].mjs",
			},
			{
				dir: "dist",
				format: "cjs",
				exports: "named",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].cjs",
			},
		],
		treeshake: false,
		plugins: [
			del({
				targets: "dist/plugins/cors",
				runOnce: true,
			}),
			dts({
				tsconfigPath: "scripts/plugins/cors/tsconfig.build.json",
				outDirs: "dist",
				bundleTypes: false,
				entryRoot: "scripts",
				compilerOptions: {
					rootDir: "scripts",
					types: ["node", "web"],
				},
			}),
		],
	},
	{
		input: "scripts/plugins/cookie/index.ts",
		platform: "neutral",
		external,
		tsconfig: "scripts/plugins/cookie/tsconfig.build.json",
		output: [
			{
				dir: "dist",
				format: "esm",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].mjs",
			},
			{
				dir: "dist",
				format: "cjs",
				exports: "named",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].cjs",
			},
		],
		treeshake: false,
		plugins: [
			del({
				targets: "dist/plugins/cookie",
				runOnce: true,
			}),
			dts({
				tsconfigPath: "scripts/plugins/cookie/tsconfig.build.json",
				outDirs: "dist",
				bundleTypes: false,
				entryRoot: "scripts",
				compilerOptions: {
					rootDir: "scripts",
					types: ["node", "web"],
				},
			}),
		],
	},

	// interfaces
	{
		input: "scripts/interfaces/node/index.ts",
		platform: "node",
		external,
		tsconfig: "scripts/interfaces/node/tsconfig.build.json",
		output: [
			{
				dir: "dist",
				format: "esm",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].mjs",
			},
			{
				dir: "dist",
				format: "cjs",
				exports: "named",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].cjs",
			},
		],
		treeshake: false,
		plugins: [
			del({
				targets: "dist/interfaces/node",
				runOnce: true,
			}),
			dts({
				tsconfigPath: "scripts/interfaces/node/tsconfig.build.json",
				outDirs: "dist",
				bundleTypes: false,
				entryRoot: "scripts",
				compilerOptions: {
					rootDir: "scripts",
					types: ["node", "web"],
				},
			}),
		],
	},
	{
		input: "scripts/interfaces/bun/index.ts",
		platform: "neutral",
		external,
		tsconfig: "scripts/interfaces/bun/tsconfig.build.json",
		output: [
			{
				dir: "dist",
				format: "esm",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].mjs",
			},
			{
				dir: "dist",
				format: "cjs",
				exports: "named",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].cjs",
			},
		],
		treeshake: false,
		plugins: [
			del({
				targets: "dist/interfaces/bun",
				runOnce: true,
			}),
			dts({
				tsconfigPath: "scripts/interfaces/bun/tsconfig.build.json",
				outDirs: "dist",
				bundleTypes: false,
				entryRoot: "scripts",
				compilerOptions: {
					rootDir: "scripts",
					types: ["node", "web"],
				},
			}),
		],
	},
	{
		input: "scripts/interfaces/deno/index.ts",
		platform: "neutral",
		external,
		tsconfig: "scripts/interfaces/deno/tsconfig.build.json",
		output: [
			{
				dir: "dist",
				format: "esm",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].mjs",
			},
			{
				dir: "dist",
				format: "cjs",
				exports: "named",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].cjs",
			},
		],
		treeshake: false,
		plugins: [
			del({
				targets: "dist/interfaces/deno",
				runOnce: true,
			}),
			dts({
				tsconfigPath: "scripts/interfaces/deno/tsconfig.build.json",
				outDirs: "dist",
				bundleTypes: false,
				entryRoot: "scripts",
				compilerOptions: {
					rootDir: "scripts",
					types: ["node", "web"],
				},
			}),
		],
	},

	// client
	{
		input: "scripts/client/index.ts",
		platform: "browser",
		external,
		tsconfig: "scripts/client/tsconfig.build.json",
		output: [
			{
				dir: "dist",
				format: "esm",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].mjs",
			},
			{
				dir: "dist",
				format: "cjs",
				exports: "named",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].cjs",
			},
		],
		treeshake: false,
		plugins: [
			del({
				targets: "dist/client",
				runOnce: true,
			}),
			dts({
				tsconfigPath: "scripts/client/tsconfig.build.json",
				outDirs: "dist",
				bundleTypes: false,
				entryRoot: "scripts",
				compilerOptions: {
					rootDir: "scripts",
					types: ["node", "web"],
				},
			}),
		],
	},

	// core
	{
		input: "scripts/core/index.ts",
		platform: "neutral",
		external,
		tsconfig: "scripts/core/tsconfig.build.json",
		output: [
			{
				dir: "dist",
				format: "esm",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].mjs",
			},
			{
				dir: "dist",
				format: "cjs",
				exports: "named",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].cjs",
			},
		],
		treeshake: false,
		plugins: [
			del({
				targets: "dist/core",
				runOnce: true,
			}),
			dts({
				tsconfigPath: "scripts/core/tsconfig.build.json",
				outDirs: "dist",
				bundleTypes: false,
				entryRoot: "scripts",
				compilerOptions: {
					rootDir: "scripts",
					types: ["node", "web"],
				},
			}),
		],
	},
]);
