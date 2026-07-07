import { Typescript } from "@duplojs/data-parser-tools";
import { resolveTsconfig } from "@duplojs/http/codeGenerator";
import { getCurrentWorkDirectoryOrThrow, SF } from "@duplojs/server-utils";
import { type AnyTuple, E, S } from "@duplojs/utils";

const tsconfig = E.unwrapByInformationOrThrow(
	resolveTsconfig(
		getCurrentWorkDirectoryOrThrow(),
		"core/tsconfig.json",
	),
	"success",
);

const compilerOptions = {
	...tsconfig.options,
	noEmit: false,
	declaration: true,
	emitDeclarationOnly: true,
	declarationDir: "core/temp",
};

const program = Typescript.createProgram({
	rootNames: tsconfig.fileNames,
	options: compilerOptions,
	projectReferences: tsconfig.projectReferences,
});

const projectFiles = program.getRootFileNames();

const virtualFiles = new Map<string, {
	content: string;
	exportedRouteType: AnyTuple<string>;
}>();

const routeDeclarationRegex = /(^|void\s+|(export\s+)?(const|var|let)\s+(?<varName>[a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*)useRouteBuilder\s*\(\s*"/gm;

for (const fileName of projectFiles) {
	await E.rightAsyncPipe(
		SF.readTextFile(fileName),
		(content) => {
			let exportedRouteType: AnyTuple<string> | undefined = undefined;

			const result = S.replace(
				content,
				routeDeclarationRegex,
				({ matchedValue, offset, namedGroups }) => {
					const typeName = `Route_${virtualFiles.size}_${offset}`;
					exportedRouteType = exportedRouteType
						? [...exportedRouteType, typeName]
						: [typeName];

					const declarationRoute = namedGroups?.varName
						? matchedValue
						: `const ${typeName} = ${matchedValue}`;

					return `export type ${typeName} = import("@duplojs/http/codeGenerator").RouteToClientRoute<typeof ${namedGroups?.varName || typeName}>;\n${declarationRoute}`;
				},
			);

			if (exportedRouteType) {
				virtualFiles.set(fileName, {
					content: result,
					exportedRouteType,
				});
			}
		},
	);
}

const host = Typescript.createCompilerHost(compilerOptions);
const originalReadFile = host.readFile.bind(host);
host.readFile = (fileName) => virtualFiles.get(fileName)?.content || originalReadFile(fileName);

const newProgram = Typescript.createProgram({
	rootNames: tsconfig.fileNames,
	options: compilerOptions,
	projectReferences: tsconfig.projectReferences,
	host,
	oldProgram: program,
});

// généré l'index
// génére une deuxéime fois mais en résolvant le type pars inférence pour le rendre plus simple
// résoudre le path typescript
// threeshaker les type pour garder que le néccésaire

newProgram.emit(
	undefined,
	(fileName, content) => void console.log(fileName, content),
	undefined,
	true,
);
