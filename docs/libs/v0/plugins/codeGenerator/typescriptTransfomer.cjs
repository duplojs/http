'use strict';

var DataParserToTypescript = require('@duplojs/data-parser-tools/toTypescript');
var serverUtils = require('@duplojs/server-utils');
var utils = require('@duplojs/utils');
var typescript = require('typescript');

const fileTransformer = DataParserToTypescript.createTransformer(serverUtils.SDP.fileKind.has, (__, { success }) => success(typescript.factory.createTypeReferenceNode("File")));
const dateTransformer = DataParserToTypescript.createTransformer(utils.DP.dateKind.has, (__, { success, addImport }) => {
    addImport("@duplojs/utils/date", "TheDate");
    addImport("@duplojs/utils/date", "SerializedTheDate");
    return success(typescript.factory.createUnionTypeNode([
        typescript.factory.createTypeReferenceNode(typescript.factory.createIdentifier("SerializedTheDate")),
        typescript.factory.createTypeReferenceNode(typescript.factory.createIdentifier("TheDate")),
    ]));
});
const timeTransformer = DataParserToTypescript.createTransformer(utils.DP.timeKind.has, (__, { success, addImport }) => {
    addImport("@duplojs/utils/date", "TheTime");
    addImport("@duplojs/utils/date", "SerializedTheTime");
    return success(typescript.factory.createUnionTypeNode([
        typescript.factory.createTypeReferenceNode(typescript.factory.createIdentifier("SerializedTheTime")),
        typescript.factory.createTypeReferenceNode(typescript.factory.createIdentifier("TheTime")),
    ]));
});

exports.dateTransformer = dateTransformer;
exports.fileTransformer = fileTransformer;
exports.timeTransformer = timeTransformer;
