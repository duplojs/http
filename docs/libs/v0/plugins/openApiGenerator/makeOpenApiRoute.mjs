import '../../core/builders/index.mjs';
import '../../core/metadata/index.mjs';
import '../../core/response/index.mjs';
import { DP } from '@duplojs/utils';
import { useRouteBuilder } from '../../core/builders/route/builder.mjs';
import { IgnoreByRouteStoreMetadata } from '../../core/metadata/ignoreByRouteStore.mjs';
import { ResponseContract } from '../../core/response/contract.mjs';

function makeOpenApiRoute(routePath, openApiPage) {
    return useRouteBuilder("GET", routePath, { metadata: [IgnoreByRouteStoreMetadata()] })
        .handler(ResponseContract.ok("swaggerUi", DP.string()), (__, { response }) => response("swaggerUi", openApiPage)
        .setHeader("content-type", "text/html"));
}

export { makeOpenApiRoute };
