import { createTransformer, defaultTransformers } from '@duplojs/data-parser-tools/toTypescript';
import { Typescript } from '@duplojs/data-parser-tools/typescript';
import { SDP } from '@duplojs/server-utils';
import { DP } from '@duplojs/utils';

const fileTransformer = createTransformer(SDP.fileKind.has, (__, { success }) => success(Typescript.factory.createTypeReferenceNode("File")));
const dateTransformer = createTransformer(DP.dateKind.has, (__, { success, addImport }) => {
    addImport("@duplojs/utils/date", "TheDate");
    addImport("@duplojs/utils/date", "SerializedTheDate");
    return success(Typescript.factory.createUnionTypeNode([
        Typescript.factory.createTypeReferenceNode(Typescript.factory.createIdentifier("SerializedTheDate")),
        Typescript.factory.createTypeReferenceNode(Typescript.factory.createIdentifier("TheDate")),
    ]));
});
const timeTransformer = createTransformer(DP.timeKind.has, (__, { success, addImport }) => {
    addImport("@duplojs/utils/date", "TheTime");
    addImport("@duplojs/utils/date", "SerializedTheTime");
    return success(Typescript.factory.createUnionTypeNode([
        Typescript.factory.createTypeReferenceNode(Typescript.factory.createIdentifier("SerializedTheTime")),
        Typescript.factory.createTypeReferenceNode(Typescript.factory.createIdentifier("TheTime")),
    ]));
});
const typescriptTransformers = [
    fileTransformer,
    dateTransformer,
    timeTransformer,
    ...defaultTransformers,
];

export { dateTransformer, fileTransformer, timeTransformer, typescriptTransformers };
