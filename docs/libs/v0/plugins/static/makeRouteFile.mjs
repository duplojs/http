import { SDP } from '@duplojs/server-utils';
import { kindHeritage, A, E, unwrap } from '@duplojs/utils';
import '../../core/builders/index.mjs';
import '../../core/metadata/index.mjs';
import '../../core/response/index.mjs';
import { createCacheControllerHooks } from '../cacheController/hooks.mjs';
import { createStaticPluginKind } from './kind.mjs';
import { useRouteBuilder } from '../../core/builders/route/builder.mjs';
import { IgnoreByRouteStoreMetadata } from '../../core/metadata/ignoreByRouteStore.mjs';
import { ResponseContract } from '../../core/response/contract.mjs';

class MissingSelectedStaticFileError extends kindHeritage("missing-selected-static-file", createStaticPluginKind("missing-selected-static-file"), Error) {
    source;
    constructor(source) {
        super({}, [`Missing selected static file: ${source.path}.`]);
        this.source = source;
    }
}
class SelectedStaticFileIsNotFileError extends kindHeritage("selected-static-file-is-not-file", createStaticPluginKind("selected-static-file-is-not-file"), Error) {
    source;
    constructor(source) {
        super({}, [`Selected static file is not file: ${source.path}.`]);
        this.source = source;
    }
}
function makeRouteFile(params) {
    const localPath = A.coalescing(params.path);
    return useRouteBuilder("GET", localPath, {
        metadata: [IgnoreByRouteStoreMetadata()],
        hooks: [createCacheControllerHooks(params.cacheControlConfig)],
    })
        .handler([
        ResponseContract.ok("resource.found", SDP.file()),
        ResponseContract.notModified("resource.notModified"),
    ], async (__, { response, request }) => {
        const sourceStatResult = await params.source.stat();
        if (E.isLeft(sourceStatResult)) {
            throw new MissingSelectedStaticFileError(params.source);
        }
        const resourceStat = unwrap(sourceStatResult);
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

export { MissingSelectedStaticFileError, SelectedStaticFileIsNotFileError, makeRouteFile };
