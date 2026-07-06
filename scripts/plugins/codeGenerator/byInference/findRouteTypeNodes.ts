import { Typescript } from "@duplojs/data-parser-tools";
import { SF } from "@duplojs/server-utils";
import { E, unwrap, type AnyTuple } from "@duplojs/utils";

export interface FindRoutesParams {
	includesFolders: AnyTuple<string>;
}

export async function findRouteTypeNodes(
	program: Typescript.Program,
	checker: Typescript.TypeChecker,
	params: FindRoutesParams,
) {
	const result = new Set<Typescript.TypeNode>();

	for (const path of params.includesFolders) {
		const maybeWalker = await SF.walkDirectory(path);

		if (E.isLeft(maybeWalker)) {
			return E.left("failed-to-read-directory", { path });
		}

		for (const entry of unwrap(maybeWalker)) {
			if (!SF.isFileInterface(entry)) {
				continue;
			}

			const programFile = program.getSourceFile(entry.path);

			if (programFile === undefined) {
				continue;
			}

			programFile.forEachChild((node) => {
				if (
					Typescript.isExpressionStatement(node)
					&& Typescript.isCallExpression(node.expression)
					&& Typescript.isPropertyAccessExpression(node.expression.expression)
					&& node.expression.expression.name.text === "handler"
				) {
					const signature = checker.getResolvedSignature(node.expression);
					if (signature === undefined) {
						return signature;
					}

					const returnType = checker.getReturnTypeOfSignature(signature);
					const returnTypeNode = checker.typeToTypeNode(
						returnType,
						node.expression,
						Typescript.NodeBuilderFlags.NoTruncation
						| Typescript.TypeFormatFlags.InTypeAlias,
					);

					if (returnTypeNode) {
						result.add(returnTypeNode);
					}
				}
			});
		}
	}

	return E.success(result);
}
