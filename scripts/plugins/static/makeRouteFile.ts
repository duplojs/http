import { SDP, type SF } from "@duplojs/server-utils";
import { A, type AnyTuple, E, unwrap } from "@duplojs/utils";

import { useRouteBuilder } from "@core/builders";
import { IgnoreByRouteStoreMetadata } from "@core/metadata";
import { ResponseContract } from "@core/response";
import type { RoutePath } from "@core/route";
import { createCacheControllerHook, type CacheControlResponseDirectives } from "@plugin-cacheController/hooks";

interface MakeRouteFileParams {
	readonly source: SF.FileInterface;
	readonly path: RoutePath | AnyTuple<RoutePath>;
	readonly cacheControlConfig?: CacheControlResponseDirectives;
}

export function makeRouteFile(params: MakeRouteFileParams) {
	const localPath = A.coalescing(params.path);

	return useRouteBuilder(
		"GET",
		localPath,
		{
			metadata: [IgnoreByRouteStoreMetadata()],
			hooks: [
				createCacheControllerHook({
					response: params.cacheControlConfig,
				}),
			],
		},
	)
		.handler(
			[
				ResponseContract.ok("resource.found", SDP.file()),
				ResponseContract.notFound("resource.notfound"),
				ResponseContract.notModified("resource.notModified"),
			],
			async(__, { response, request }) => {
				const sourceStatResult = await params.source.stat();

				if (E.isLeft(sourceStatResult)) {
					return response("resource.notfound");
				}

				const resourceStat = unwrap(sourceStatResult);

				if (!resourceStat.isFile) {
					return response("resource.notfound");
				}

				if (
					request.headers["if-modified-since"]
					&& typeof request.headers["if-modified-since"] === "string"
					&& resourceStat.modifiedAt
					&& new Date(request.headers["if-modified-since"]).getTime() >= resourceStat.modifiedAt.getTime()
				) {
					return response("resource.notModified")
						.setHeader("last-modified", resourceStat.modifiedAt.toISOString());
				}

				return resourceStat.modifiedAt
					? response("resource.found", params.source)
						.setHeader("last-modified", resourceStat.modifiedAt.toISOString())
					: response("resource.found", params.source);
			},
		);
}
