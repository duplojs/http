import { createTransformer } from "@duplojs/data-parser-tools/toTypescript";
import { SDP } from "@duplojs/server-utils";
import { factory } from "typescript";

export const fileTransformer = createTransformer(
	SDP.fileKind.has,
	(__, { success }) => success(factory.createTypeReferenceNode("File")),
);
