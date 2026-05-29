import { DataParserToTypescript } from "@duplojs/data-parser-tools";
import { createTransformer } from "@duplojs/data-parser-tools/toTypescript";
import { SDP } from "@duplojs/server-utils";
import { DP } from "@duplojs/utils";
import { factory } from "typescript";

export const fileTransformer = createTransformer(
	SDP.fileKind.has,
	(__, { success }) => success(factory.createTypeReferenceNode("File")),
);

export const dateTransformer = createTransformer(
	DP.dateKind.has,
	(__, { success, addImport }) => {
		addImport("@duplojs/utils/date", "TheDate");
		addImport("@duplojs/utils/date", "SerializedTheDate");

		return success(factory.createUnionTypeNode([
			factory.createTypeReferenceNode(
				factory.createIdentifier("SerializedTheDate"),
			),
			factory.createTypeReferenceNode(
				factory.createIdentifier("TheDate"),
			),
		]));
	},
);

export const timeTransformer = createTransformer(
	DP.timeKind.has,
	(__, { success, addImport }) => {
		addImport("@duplojs/utils/date", "TheTime");
		addImport("@duplojs/utils/date", "SerializedTheTime");

		return success(factory.createUnionTypeNode([
			factory.createTypeReferenceNode(
				factory.createIdentifier("SerializedTheTime"),
			),
			factory.createTypeReferenceNode(
				factory.createIdentifier("TheTime"),
			),
		]));
	},
);

export const typescriptTransformers = [
	fileTransformer,
	dateTransformer,
	timeTransformer,
	...DataParserToTypescript.defaultTransformers,
];
