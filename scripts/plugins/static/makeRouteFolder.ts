import { SDP, SF } from "@duplojs/server-utils";
import { A, type AnyTuple, type D, E, escapeRegExp, Path, pipe, S, unwrap, whenNot } from "@duplojs/utils";

import { useRouteBuilder } from "@core/builders";
import { IgnoreByRouteStoreMetadata } from "@core/metadata";
import { ResponseContract } from "@core/response";
import type { RoutePath } from "@core/route";
import { createCacheControllerHook, type CacheControlResponseDirectives } from "@plugin-cacheController/hooks";

interface MakeRouteFolderParams {
	readonly source: SF.FolderInterface;
	readonly prefix: RoutePath | AnyTuple<RoutePath>;
	readonly cacheControlConfig?: CacheControlResponseDirectives;
	readonly directoryIndexFilePrefix?: string;
}

export function makeRouteFolder(params: MakeRouteFolderParams) {
	const sourcePath = whenNot(
		params.source.path,
		S.endsWith("/"),
		S.concat("/"),
	);

	const localPrefix = A.coalescing(params.prefix);

	const routePath = A.mapTuple(
		localPrefix,
		(prefix) => <const>`${prefix}/*`,
	);

	const prefixRegex = pipe(
		localPrefix,
		A.map(escapeRegExp),
		A.join("|"),
		(value) => new RegExp(`^(?:${value})(?:/|$)`),
	);

	return useRouteBuilder(
		"GET",
		routePath,
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
			async(__, { request, response }) => {
				if (!Path.isAbsolute(request.path)) {
					return response("resource.notfound");
				}

				const resourcePath = pipe(
					request.path,
					S.replace(prefixRegex, ""),
					S.prepend(sourcePath),
				);

				const replyFile = (
					file: SF.FileInterface,
					modifiedAt: D.TheDate | null,
				) => {
					if (
						request.headers["if-modified-since"]
						&& typeof request.headers["if-modified-since"] === "string"
						&& modifiedAt
						&& new Date(request.headers["if-modified-since"]).getTime() >= modifiedAt.getTime()
					) {
						return response("resource.notModified")
							.setHeader("last-modified", modifiedAt.toISOString());
					}

					return modifiedAt
						? response("resource.found", file)
							.setHeader("last-modified", modifiedAt.toISOString())
						: response("resource.found", file);
				};

				const resource = SF.createFileInterface(resourcePath);
				const resourceStatResult = await resource.stat();

				if (E.isLeft(resourceStatResult)) {
					return response("resource.notfound");
				}

				const resourceStat = unwrap(resourceStatResult);

				if (resourceStat.isFile) {
					return replyFile(resource, resourceStat.modifiedAt);
				}

				if (!params.directoryIndexFilePrefix) {
					return response("resource.notfound");
				}

				const indexResource = SF.createFileInterface(
					`${resourcePath}/${params.directoryIndexFilePrefix}`,
				);
				const indexStatResult = await indexResource.stat();

				if (E.isLeft(indexStatResult)) {
					return response("resource.notfound");
				}

				const indexStat = unwrap(indexStatResult);

				if (!indexStat.isFile) {
					return response("resource.notfound");
				}

				return replyFile(indexResource, indexStat.modifiedAt);
			},
		);
}
