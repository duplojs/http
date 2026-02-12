import { mimeType, Path } from "@duplojs/utils";
import { readFile } from "node:fs/promises";

export async function createFileToSend(path: string, name?: string) {
	const blob = new Blob([await readFile(path)]);

	return new File([blob], name ?? Path.getBaseName(path) ?? "", {
		type: mimeType.get(Path.getExtensionName(path) ?? ""),
		lastModified: Date.now(),
	});
}
