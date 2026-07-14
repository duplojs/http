import { Typescript } from "@duplojs/data-parser-tools";
import { resolveTsconfig } from "@duplojs/http/codeGenerator";
import { getCurrentWorkDirectoryOrThrow, SF } from "@duplojs/server-utils";
import { A, type AnyTuple, asyncPipe, E, G, innerPipe, isType, justExec, O, Path, pipe, promiseAll, S } from "@duplojs/utils";

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

await SF.remove(compilerOptions.declarationDir, { recursive: true });

const program = Typescript.createProgram({
	rootNames: tsconfig.fileNames,
	options: compilerOptions,
	projectReferences: tsconfig.projectReferences,
});

const checker = program.getTypeChecker();

let routeIndex = 0;
const printer = Typescript.createPrinter();
const virtualFiles = await asyncPipe(
	tsconfig.fileNames,
	A.chunk(10),
	G.asyncMap(
		innerPipe(
			A.map((fileName) => {
				const sourceFile = program.getSourceFile(fileName);
				if (!sourceFile) {
					return null;
				}

				const newStatement = A.flatMap(
					sourceFile.statements,
					(statement) => {
						if (
							!Typescript.isExpressionStatement(statement)
							|| !Typescript.isCallExpression(statement.expression)
							|| !Typescript.isPropertyAccessExpression(statement.expression.expression)
							|| statement.expression.expression.name.text !== "handler"
						) {
							return statement;
						}

						const signature = checker.getResolvedSignature(statement.expression);
						if (!signature) {
							return statement;
						}

						const returnType = checker.getReturnTypeOfSignature(signature);
						const typeSymbol = returnType.getSymbol();
						if (!typeSymbol) {
							return statement;
						}
						if (typeSymbol.getName() !== "Route") {
							return statement;
						}

						const typeIdentifier = Typescript.factory.createIdentifier(
							`Route_${routeIndex++}`,
						);

						return [
							Typescript.factory.createVariableStatement(
								undefined,
								Typescript.factory.createVariableDeclarationList(
									[
										Typescript.factory.createVariableDeclaration(
											typeIdentifier,
											undefined,
											undefined,
											statement.expression,
										),
									],
									Typescript.NodeFlags.Const,
								),
							),
							Typescript.factory.createTypeAliasDeclaration(
								[Typescript.factory.createToken(Typescript.SyntaxKind.ExportKeyword)],
								typeIdentifier,
								undefined,
								Typescript.factory.createImportTypeNode(
									Typescript.factory.createLiteralTypeNode(
										Typescript.factory.createStringLiteral("@duplojs/http/codeGenerator"),
									),
									undefined,
									Typescript.factory.createIdentifier("RouteToClientRoute"),
									[
										Typescript.factory.createTypeQueryNode(
											typeIdentifier,
											undefined,
										),
									],
									false,
								),
							),
						];
					},
				);

				return O.entry(
					fileName,
					printer.printFile(
						Typescript.factory.updateSourceFile(
							sourceFile,
							newStatement,
						),
					),
				);
			}),
			promiseAll,
		),
	),
	G.asyncFlat,
	G.asyncFilter(isType("array")),
	A.from,
	(value) => new Map(value),
);

const host = Typescript.createCompilerHost(compilerOptions);
const originalGetSourceFile = host.getSourceFile.bind(host);
host.getSourceFile = (
	fileName,
	languageVersion,
	onError,
	shouldCreateNewSourceFile,
) => {
	const content = virtualFiles.get(
		fileName,
	);

	if (content !== undefined) {
		return Typescript.createSourceFile(
			fileName,
			content,
			languageVersion,
			true,
		);
	}

	return originalGetSourceFile(
		fileName,
		languageVersion,
		onError,
		shouldCreateNewSourceFile,
	);
};

const newProgram = Typescript.createProgram({
	rootNames: tsconfig.fileNames,
	options: compilerOptions,
	projectReferences: tsconfig.projectReferences,
	host,
});

// // généré l'index
// // génére une deuxéime fois mais en résolvant le type pars inférence pour le rendre plus simple
// // résoudre le path typescript
// // threeshaker les type pour garder que le néccésaire

const result: any[] = [];

newProgram.emit(
	undefined,
	(fileName, content) => {
		console.log(fileName);

		result.push(
			justExec(async() => {
				const folder = Path.getParentFolderPath(fileName);

				if (folder === null) {
					return SF.writeTextFile(fileName, content);
				}

				await SF.makeDirectory(folder, { recursive: true });

				return SF.writeTextFile(fileName, content);
			}),
		);
	},
	undefined,
	true,
);

await promiseAll(result);
