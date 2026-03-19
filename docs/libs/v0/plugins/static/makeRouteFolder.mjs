import { SDP, SF } from '@duplojs/server-utils';
import { whenNot, S, A, pipe, escapeRegExp, innerPipe, Path, E, unwrap } from '@duplojs/utils';
import '../../core/builders/index.mjs';
import '../../core/metadata/index.mjs';
import '../../core/response/index.mjs';
import { createCacheControllerHooks } from '../cacheController/hooks.mjs';
import { useRouteBuilder } from '../../core/builders/route/builder.mjs';
import { IgnoreByRouteStoreMetadata } from '../../core/metadata/ignoreByRouteStore.mjs';
import { ResponseContract } from '../../core/response/contract.mjs';

function makeRouteFolder(params) {
    const sourcePath = whenNot(params.source.path, S.endsWith("/"), S.concat("/"));
    const localPrefix = A.coalescing(params.prefix);
    const routePath = A.mapTuple(localPrefix, (prefix) => `${prefix}/*`);
    const prefixRegex = pipe(localPrefix, A.map(escapeRegExp), A.join("|"), (value) => new RegExp(`^(?:${value})(?:/|$)`));
    const getResourcePath = innerPipe(S.replace(prefixRegex, ""), S.prepend(sourcePath), S.replace(/\/+$/, ""));
    return useRouteBuilder("GET", routePath, {
        metadata: [IgnoreByRouteStoreMetadata()],
        hooks: [createCacheControllerHooks(params.cacheControlConfig)],
    })
        .handler([
        ResponseContract.ok("resource.found", SDP.file()),
        ResponseContract.notFound("resource.notfound"),
        ResponseContract.notModified("resource.notModified"),
    ], async (__, { request, response }) => {
        if (!Path.isAbsolute(request.path)) {
            return response("resource.notfound");
        }
        const resourcePath = getResourcePath(request.path);
        const resultStat = await SF.stat(resourcePath);
        if (E.isLeft(resultStat)) {
            return response("resource.notfound");
        }
        const stat = unwrap(resultStat);
        if (stat.isDirectory && !params.directoryFallBackFile) {
            return response("resource.notfound");
        }
        const resource = SF.createFileInterface(stat.isDirectory && params.directoryFallBackFile
            ? `${resourcePath}/${params.directoryFallBackFile}`
            : resourcePath);
        const resultResourceStat = stat.isFile
            ? stat
            : await resource.stat();
        if (E.isLeft(resultResourceStat)) {
            return response("resource.notfound");
        }
        const resourceStat = unwrap(resultResourceStat);
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

export { makeRouteFolder };
