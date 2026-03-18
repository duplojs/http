'use strict';

var serverUtils = require('@duplojs/server-utils');
var utils = require('@duplojs/utils');
require('../../core/builders/index.cjs');
require('../../core/metadata/index.cjs');
require('../../core/response/index.cjs');
var hooks = require('../cacheController/hooks.cjs');
var builder = require('../../core/builders/route/builder.cjs');
var ignoreByRouteStore = require('../../core/metadata/ignoreByRouteStore.cjs');
var contract = require('../../core/response/contract.cjs');

function makeRouteFolder(params) {
    const sourcePath = utils.whenNot(params.source.path, utils.S.endsWith("/"), utils.S.concat("/"));
    const localPrefix = utils.A.coalescing(params.prefix);
    const routePath = utils.A.mapTuple(localPrefix, (prefix) => `${prefix}/*`);
    const prefixRegex = utils.pipe(localPrefix, utils.A.map(utils.escapeRegExp), utils.A.join("|"), (value) => new RegExp(`^(?:${value})(?:/|$)`));
    const getResourcePath = utils.innerPipe(utils.S.replace(prefixRegex, ""), utils.S.prepend(sourcePath), utils.S.replace(/\/+$/, ""));
    return builder.useRouteBuilder("GET", routePath, {
        metadata: [ignoreByRouteStore.IgnoreByRouteStoreMetadata()],
        hooks: [hooks.createCacheControllerHooks(params.cacheControlConfig)],
    })
        .handler([
        contract.ResponseContract.ok("resource.found", serverUtils.SDP.file()),
        contract.ResponseContract.notFound("resource.notfound"),
        contract.ResponseContract.notModified("resource.notModified"),
    ], async (__, { request, response }) => {
        if (!utils.Path.isAbsolute(request.path)) {
            return response("resource.notfound");
        }
        const resourcePath = getResourcePath(request.path);
        const resultStat = await serverUtils.SF.stat(resourcePath);
        if (utils.E.isLeft(resultStat)) {
            return response("resource.notfound");
        }
        const stat = utils.unwrap(resultStat);
        if (stat.isDirectory && !params.directoryFallBackFile) {
            return response("resource.notfound");
        }
        const resource = serverUtils.SF.createFileInterface(stat.isDirectory && params.directoryFallBackFile
            ? `${resourcePath}/${params.directoryFallBackFile}`
            : resourcePath);
        const resultResourceStat = stat.isFile
            ? stat
            : await resource.stat();
        if (utils.E.isLeft(resultResourceStat)) {
            return response("resource.notfound");
        }
        const resourceStat = utils.unwrap(resultResourceStat);
        if (!resourceStat.isFile) {
            return response("resource.notfound");
        }
        if (request.headers["if-modified-since"]
            && typeof request.headers["if-modified-since"] === "string"
            && resourceStat.modifiedAt
            && new Date(request.headers["if-modified-since"]).getTime() >= resourceStat.modifiedAt.getTime()) {
            return response("resource.notModified")
                .setHeader("last-modified", resourceStat.modifiedAt.toISOString());
        }
        return resourceStat.modifiedAt
            ? response("resource.found", resource)
                .setHeader("last-modified", resourceStat.modifiedAt.toISOString())
            : response("resource.found", resource);
    });
}

exports.makeRouteFolder = makeRouteFolder;
