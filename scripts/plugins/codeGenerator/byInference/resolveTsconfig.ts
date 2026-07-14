import { Typescript } from "@duplojs/data-parser-tools";
import { A, pipe, E, Path } from "@duplojs/utils";

export function resolveTsconfig(
	currentWorkDir: string,
	tsconfigPath: string,
) {
	const absolutePath = Path.resolveFrom(currentWorkDir, [tsconfigPath]);

	if (absolutePath === null) {
		return E.left("failed-to-resolve-path");
	}

	const readResult = Typescript.readConfigFile(
		absolutePath,
		Typescript.sys.readFile,
	);

	if (readResult.error) {
		return E.left(
			"failed-to-read-tsconfig",
			{ message: Typescript.flattenDiagnosticMessageText(readResult.error.messageText, "\n") },
		);
	}

	const parentDir = Path.getParentFolderPath(absolutePath);
	if (parentDir === null) {
		return E.left("failed-to-resolve-parent-folder");
	}

	const parsed = Typescript.parseJsonConfigFileContent(
		readResult.config,
		Typescript.sys,
		parentDir,
		undefined,
		absolutePath,
	);

	if (A.minElements(parsed.errors, 1)) {
		return E.left(
			"failed-to-resolve-tsconfig",
			{
				message: pipe(
					parsed.errors,
					A.map((error) => Typescript.flattenDiagnosticMessageText(error.messageText, "\n")),
					A.join("\n"),
				),
			},
		);
	}

	return E.success(parsed);
}
