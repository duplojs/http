import { type AnyTuple, E, kindHeritage, P, toCurriedPredicate, unwrap } from "@duplojs/utils";
import { SF } from "@duplojs/server-utils";

import type { HubPlugin } from "@core/hub";
import type { RoutePath } from "@core/route";
import type { CacheControlResponseDirectives } from "@plugin-cacheController/hooks/createCacheController/types";

import { createStaticPluginKind } from "./kind";
import { makeRouteFile } from "./makeRouteFile";
import { makeRouteFolder } from "./makeRouteFolder";

export interface BaseStaticPluginParams {
	readonly cacheControlConfig?: CacheControlResponseDirectives;
}

export interface StaticPluginFileParams extends BaseStaticPluginParams {
	readonly path: RoutePath | AnyTuple<RoutePath>;
}

export interface StaticPluginFolderParams extends BaseStaticPluginParams {

	readonly prefix: RoutePath | AnyTuple<RoutePath>;
	readonly directoryIndexFilePrefix?: string;
}

export class StaticPluginError extends kindHeritage(
	"StaticPluginError",
	createStaticPluginKind("static-plugin-error"),
	Error,
) {
	public constructor(
		public information: string,
		public error: unknown,
	) {
		super({}, ["Error during registration static route."]);
	}
}

export function staticPlugin(
	source: SF.FolderInterface,
	params: StaticPluginFolderParams
): HubPlugin;

export function staticPlugin(
	source: SF.FileInterface,
	params: StaticPluginFileParams
): HubPlugin;

export function staticPlugin(
	...args:
		| [SF.FolderInterface, StaticPluginFolderParams]
		| [SF.FileInterface, StaticPluginFileParams]
): HubPlugin {
	const route = P.match(args)
		.with(
			[toCurriedPredicate(SF.isFolderInterface)],
			([source, params]) => makeRouteFolder({
				source,
				...params,
			}),
		)
		.with(
			[toCurriedPredicate(SF.isFileInterface)],
			([source, params]) => makeRouteFile({
				source,
				...params,
			}),
		)
		.exhaustive();

	return {
		name: "static",
		routes: [route],
		hooksHubLifeCycle: [
			{
				beforeStartServer: async() => {
					const statResult = await args[0].stat();

					if (E.isLeft(statResult)) {
						throw new StaticPluginError(
							"source does not exit.",
							statResult,
						);
					}

					const stat = unwrap(statResult);

					if (SF.isFileInterface(args[0]) && !stat.isFile) {
						throw new StaticPluginError(
							"source does not file (consistency).",
							{
								source: args[0],
								stat,
							},
						);
					} else if (SF.isFolderInterface(args[0]) && stat.isFile) {
						throw new StaticPluginError(
							"source does not folder (consistency).",
							{
								source: args[0],
								stat,
							},
						);
					}
				},
			},
		],
	};
}
