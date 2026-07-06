import { Typescript } from "@duplojs/data-parser-tools";
import { findRouteTypeNodes, resolveTsconfig } from "@duplojs/http/codeGenerator";
import { getCurrentWorkDirectoryOrThrow } from "@duplojs/server-utils";
import { E } from "@duplojs/utils";

const tsconfig = E.unwrapByInformationOrThrow(
	resolveTsconfig(
		getCurrentWorkDirectoryOrThrow(),
		"core/tsconfig.json",
	),
	"success",
);

const program = Typescript.createProgram({
	rootNames: tsconfig.fileNames,
	options: tsconfig.options,
	projectReferences: tsconfig.projectReferences,
});

const checker = program.getTypeChecker();

const result = E.unwrapByInformationOrThrow(
	await findRouteTypeNodes(
		program,
		checker,
		{ includesFolders: ["core/routes"] },
	),
	"success",
);

for (const value of result) {
	console.log(value);
}
