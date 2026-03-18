'use strict';

var serverUtils = require('@duplojs/server-utils');
var utils = require('@duplojs/utils');
require('../../core/builders/index.cjs');
require('../../core/metadata/index.cjs');
require('../../core/response/index.cjs');
var hooks = require('../cacheController/hooks.cjs');
var kind = require('./kind.cjs');
var builder = require('../../core/builders/route/builder.cjs');
var ignoreByRouteStore = require('../../core/metadata/ignoreByRouteStore.cjs');
var contract = require('../../core/response/contract.cjs');

class MissingSelectedStaticFileError extends utils.kindHeritage("missing-selected-static-file", kind.createStaticPluginKind("missing-selected-static-file"), Error) {
    source;
    constructor(source) {
        super({}, [`Missing selected static file: ${source.path}.`]);
        this.source = source;
    }
}
class SelectedStaticFileIsNotFileError extends utils.kindHeritage("selected-static-file-is-not-file", kind.createStaticPluginKind("selected-static-file-is-not-file"), Error) {
    source;
    constructor(source) {
        super({}, [`Selected static file is not file: ${source.path}.`]);
        this.source = source;
    }
}
function makeRouteFile(params) {
    const localPath = utils.A.coalescing(params.path);
    return builder.useRouteBuilder("GET", localPath, {
        metadata: [ignoreByRouteStore.IgnoreByRouteStoreMetadata()],
        hooks: [hooks.createCacheControllerHooks(params.cacheControlConfig)],
    })
        .handler([
        contract.ResponseContract.ok("resource.found", serverUtils.SDP.file()),
        contract.ResponseContract.notModified("resource.notModified"),
    ], async (__, { response, request }) => {
        const sourceStatResult = await params.source.stat();
        if (utils.E.isLeft(sourceStatResult)) {
            throw new MissingSelectedStaticFileError(params.source);
        }
        const resourceStat = utils.unwrap(sourceStatResult);
        if (!resourceStat.isFile) {
            throw new SelectedStaticFileIsNotFileError(params.source);
        }
        if (request.headers["if-modified-since"]
            && typeof request.headers["if-modified-since"] === "string"
            && resourceStat.modifiedAt
            && new Date(request.headers["if-modified-since"]).getTime() >= resourceStat.modifiedAt.getTime()) {
            return response("resource.notModified")
                .setHeader("last-modified", resourceStat.modifiedAt.toISOString());
        }
        return resourceStat.modifiedAt
            ? response("resource.found", params.source)
                .setHeader("last-modified", resourceStat.modifiedAt.toISOString())
            : response("resource.found", params.source);
    });
}

exports.MissingSelectedStaticFileError = MissingSelectedStaticFileError;
exports.SelectedStaticFileIsNotFileError = SelectedStaticFileIsNotFileError;
exports.makeRouteFile = makeRouteFile;
