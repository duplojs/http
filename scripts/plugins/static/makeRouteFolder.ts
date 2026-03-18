import { SDP, SF } from "@duplojs/server-utils";
import { A, type AnyTuple, E, escapeRegExp, innerPipe, Path, pipe, S, unwrap, whenNot } from "@duplojs/utils";

import { useRouteBuilder } from "@core/builders";
import { IgnoreByRouteStoreMetadata } from "@core/metadata";
import { ResponseContract } from "@core/response";
import type { RoutePath } from "@core/route";
import { createCacheControllerHooks } from "@plugin-cacheController/hooks";
import { type CacheControlDirectives } from "@plugin-cacheController/types";

interface MakeRouteFolderParams {
	readonly source: SF.FolderInterface;
	readonly prefix: RoutePath | AnyTuple<RoutePath>;
	readonly cacheControlConfig?: CacheControlDirectives;
	readonly directoryFallBackFile?: string;
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

	const getResourcePath = innerPipe(
		S.replace(prefixRegex, ""),
		S.prepend(sourcePath),
		S.replace(/\/+$/, ""),
	);

	return useRouteBuilder(
		"GET",
		routePath,
		{
			metadata: [IgnoreByRouteStoreMetadata()],
			hooks: [createCacheControllerHooks(params.cacheControlConfig)],
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

				const resourcePath = getResourcePath(request.path);

				const resultStat = await SF.stat(resourcePath);

				if (E.isLeft(resultStat)) {
					return response("resource.notfound");
				}

				const stat = unwrap(resultStat);

				if (stat.isDirectory && !params.directoryFallBackFile) {
					return response("resource.notfound");
				}

				const resource = SF.createFileInterface(
					stat.isDirectory && params.directoryFallBackFile
						? `${resourcePath}/${params.directoryFallBackFile}`
						: resourcePath,
				);

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
					? response("resource.found", resource)
						.setHeader("last-modified", resourceStat.modifiedAt.toISOString())
					: response("resource.found", resource);
			},
		);
}
