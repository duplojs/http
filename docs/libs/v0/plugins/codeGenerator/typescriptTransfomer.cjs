'use strict';

var DataParserToTypescript = require('@duplojs/data-parser-tools/toTypescript');
var serverUtils = require('@duplojs/server-utils');
var typescript = require('typescript');

const fileTransformer = DataParserToTypescript.createTransformer(serverUtils.SDP.fileKind.has, (__, { success }) => success(typescript.factory.createTypeReferenceNode("File")));

exports.fileTransformer = fileTransformer;
