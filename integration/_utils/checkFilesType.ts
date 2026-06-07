import { getCurrentWorkDirectoryOrThrow } from "@duplojs/server-utils";
import { Path } from "@duplojs/utils";
import ts from "typescript";

export function assertTypeScriptProject(tsconfigPath: string) {
	const resolvedTsconfigPath = Path.resolveRelative([getCurrentWorkDirectoryOrThrow(), tsconfigPath]);
	const tsconfigDirectory = Path.getParentFolderPath(resolvedTsconfigPath) ?? "";

	const configFileResult = ts.readConfigFile(
		resolvedTsconfigPath,
		ts.sys.readFile,
	);

	if (configFileResult.error) {
		throw new Error(formatTypeScriptDiagnostics([configFileResult.error]));
	}

	const parsedConfig = ts.parseJsonConfigFileContent(
		configFileResult.config,
		ts.sys,
		tsconfigDirectory,
		{
			noEmit: true,
		},
		resolvedTsconfigPath,
	);

	const program = ts.createProgram({
		rootNames: parsedConfig.fileNames,
		options: parsedConfig.options,
		projectReferences: parsedConfig.projectReferences,
	});

	const diagnostics = [
		...parsedConfig.errors,
		...ts.getPreEmitDiagnostics(program),
	];

	if (diagnostics.length > 0) {
		throw new Error(formatTypeScriptDiagnostics(diagnostics));
	}
}

function formatTypeScriptDiagnostics(
	diagnostics: readonly ts.Diagnostic[],
) {
	const formatHost: ts.FormatDiagnosticsHost = {
		getCanonicalFileName: (fileName) => (
			ts.sys.useCaseSensitiveFileNames
				? fileName
				: fileName.toLowerCase()
		),
		getCurrentDirectory: ts.sys.getCurrentDirectory,
		getNewLine: () => ts.sys.newLine,
	};

	return ts.formatDiagnosticsWithColorAndContext(
		diagnostics,
		formatHost,
	);
}
