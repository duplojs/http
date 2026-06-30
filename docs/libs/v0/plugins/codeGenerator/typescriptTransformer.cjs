'use strict';

var DataParserToTypescript = require('@duplojs/data-parser-tools/toTypescript');
var typescript = require('@duplojs/data-parser-tools/typescript');
var serverUtils = require('@duplojs/server-utils');
var utils = require('@duplojs/utils');

const fileTransformer = DataParserToTypescript.createTransformer(serverUtils.SDP.fileKind.has, (__, { success }) => success(typescript.Typescript.factory.createTypeReferenceNode("File")));
const dateTransformer = DataParserToTypescript.createTransformer(utils.DP.dateKind.has, (__, { success, addImport }) => {
    addImport("@duplojs/utils/date", "TheDate");
    addImport("@duplojs/utils/date", "SerializedTheDate");
    return success(typescript.Typescript.factory.createUnionTypeNode([
        typescript.Typescript.factory.createTypeReferenceNode(typescript.Typescript.factory.createIdentifier("SerializedTheDate")),
        typescript.Typescript.factory.createTypeReferenceNode(typescript.Typescript.factory.createIdentifier("TheDate")),
    ]));
});
const timeTransformer = DataParserToTypescript.createTransformer(utils.DP.timeKind.has, (__, { success, addImport }) => {
    addImport("@duplojs/utils/date", "TheTime");
    addImport("@duplojs/utils/date", "SerializedTheTime");
    return success(typescript.Typescript.factory.createUnionTypeNode([
        typescript.Typescript.factory.createTypeReferenceNode(typescript.Typescript.factory.createIdentifier("SerializedTheTime")),
        typescript.Typescript.factory.createTypeReferenceNode(typescript.Typescript.factory.createIdentifier("TheTime")),
    ]));
});
const typescriptTransformers = [
    fileTransformer,
    dateTransformer,
    timeTransformer,
    ...DataParserToTypescript.defaultTransformers,
];

exports.dateTransformer = dateTransformer;
exports.fileTransformer = fileTransformer;
exports.timeTransformer = timeTransformer;
exports.typescriptTransformers = typescriptTransformers;
