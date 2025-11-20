import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import tscAlias from 'rollup-plugin-tsc-alias';
import { defineConfig } from "rollup";

export default defineConfig({
	input: [
		"scripts/core/index.ts", 
		"scripts/interfaces/node/index.ts",
	],
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
		typescript({ tsconfig: "scripts/tsconfig.build.json" }),
		tscAlias({ configFile: "scripts/tsconfig.build.json" }),
	],
});
