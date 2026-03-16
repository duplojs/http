import { SDP, type SF } from "@duplojs/server-utils";
import { A, type AnyTuple, E, kindHeritage, unwrap } from "@duplojs/utils";

import { useRouteBuilder } from "@core/builders";
import { IgnoreByRouteStoreMetadata } from "@core/metadata";
import { ResponseContract } from "@core/response";
import type { RoutePath } from "@core/route";
import { createCacheControllerHooks } from "@plugin-cacheController/hooks";
import { type CacheControlDirectives } from "@plugin-cacheController/types";
import { createStaticPluginKind } from "./kind";

interface MakeRouteFileParams {
	readonly source: SF.FileInterface;
	readonly path: RoutePath | AnyTuple<RoutePath>;
	readonly cacheControlConfig?: CacheControlDirectives;
}

export class MissingSelectedStaticFileError extends kindHeritage(
	"missing-selected-static-file",
	createStaticPluginKind("missing-selected-static-file"),
	Error,
) {
	public constructor(
		public source: SF.FileInterface,
	) {
		super({}, [`Missing selected static file: ${source.path}.`]);
	}
}

export class SelectedStaticFileIsNotFileError extends kindHeritage(
	"selected-static-file-is-not-file",
	createStaticPluginKind("selected-static-file-is-not-file"),
	Error,
) {
	public constructor(
		public source: SF.FileInterface,
	) {
		super({}, [`Selected static file is not file: ${source.path}.`]);
	}
}

export function makeRouteFile(params: MakeRouteFileParams) {
	const localPath = A.coalescing(params.path);

	return useRouteBuilder(
		"GET",
		localPath,
		{
			metadata: [IgnoreByRouteStoreMetadata()],
			hooks: [createCacheControllerHooks(params.cacheControlConfig)],
		},
	)
		.handler(
			[
				ResponseContract.ok("resource.found", SDP.file()),
				ResponseContract.notModified("resource.notModified"),
			],
			async(__, { response, request }) => {
				const sourceStatResult = await params.source.stat();

				if (E.isLeft(sourceStatResult)) {
					throw new MissingSelectedStaticFileError(params.source);
				}

				const resourceStat = unwrap(sourceStatResult);

				if (!resourceStat.isFile) {
					throw new SelectedStaticFileIsNotFileError(params.source);
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
