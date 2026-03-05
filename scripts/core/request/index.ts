import { createExternalPromise, type E, kindHeritage, type MaybePromise } from "@duplojs/utils";
import { type GetPropsWithValue } from "@duplojs/utils/object";
import { createCoreLibKind } from "../kind";
import { type BodyReader } from "./bodyController";

export * from "./bodyController";

export interface RequestMethodsWrapper {
	GET: true;
	POST: true;
	PUT: true;
	PATCH: true;
	DELETE: true;
	HEAD: true;
	OPTIONS: true;
	TRACE: true;
	CONNECT: true;
}

export type RequestMethods = GetPropsWithValue<RequestMethodsWrapper, true>;

export interface RequestInitializationData {
	readonly headers: Partial<Record<string, string | string[]>>;
	readonly host: string;
	readonly matchedPath: string | null;
	readonly method: string;
	readonly origin: string;
	readonly params: Record<string, string>;
	readonly path: string;
	readonly query: Record<string, string | string[]>;
	readonly url: string;
	readonly bodyReader: BodyReader;
}

export class Request extends kindHeritage(
	"request",
	createCoreLibKind("request"),
) implements RequestInitializationData {
	public method: string;

	public headers: Partial<Record<string, string | string[]>>;

	public url: string;

	public host: string;

	public origin: string;

	public path: string;

	public params: Record<string, string>;

	public query: Record<string, string | string[]>;

	public matchedPath: string | null;

	public bodyReader: BodyReader;

	private bodyResult?: MaybePromise<E.Success | E.Error> = undefined;

	public filesAttache: string[] | undefined = undefined;

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
			bodyReader,
			...rest
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
		this.bodyReader = bodyReader;

		for (const key in rest) {
			this[key as never] = rest[key as never];
		}
	}

	public getBody(): MaybePromise<
		| E.Success
		| E.Error
	> {
		if (this.bodyResult !== undefined) {
			return this.bodyResult;
		}
		const externalPromise = createExternalPromise<
			| E.Success
			| E.Error
		>();

		this.bodyResult = externalPromise.promise;

		return this.bodyReader
			.read(this)
			.then((result) => {
				externalPromise.resolve(result);
				this.bodyResult = result;
				return result;
			})
			.catch((error) => {
				externalPromise.reject(error);
				throw error;
			});
	}
}
