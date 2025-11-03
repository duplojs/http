import { kindHeritage } from "@duplojs/utils";
import { type GetPropsWithValue } from "@duplojs/utils/object";
import { createCoreLibKind } from "./kind";

export interface RequestMethodsWrapper {
	GET: true;
	POST: true;
	PUT: true;
	DELETE: true;
	HEAD: true;
	OPTION: true;
}

export type RequestMethods = GetPropsWithValue<RequestMethodsWrapper, true>;

export interface RequestInitializationData {
	readonly headers: Record<string, string | string[]>;
	readonly host: string;
	readonly matchedPath: string | null;
	readonly method: string;
	readonly origin: string;
	readonly params: Record<string, string>;
	readonly path: string;
	readonly query: Record<string, string | string[]>;
	readonly url: string;
}

export class Request extends kindHeritage(
	"request",
	createCoreLibKind("request"),
) implements RequestInitializationData {
	public method: string;

	public headers: Record<string, string | string[]>;

	public url: string;

	public host: string;

	public origin: string;

	public path: string;

	public params: Record<string, string>;

	public query: Record<string, string | string[]>;

	public matchedPath: string | null;

	public body: unknown = undefined;

	public constructor(
		{
			method,
			headers,
			url,
			host,
			origin,
			path,
			params,
			query,
			matchedPath,
		}: RequestInitializationData,
	) {
		super();

		this.method = method;
		this.headers = headers;
		this.url = url;
		this.host = host;
		this.origin = origin;
		this.path = path;
		this.params = params;
		this.query = query;
		this.matchedPath = matchedPath;
	}
}
