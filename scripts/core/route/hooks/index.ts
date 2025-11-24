import { type Request } from "../../request";
import { createCoreLibKind } from "../../kind";
import { type UnionToIntersection, type AnyFunction, type Kind, type MaybePromise, type SimplifyTopLevel, type IsEqual } from "@duplojs/utils";
import { type HookResponse } from "./response";
import { type ResponseCode, type Response } from "@core/response";

export * from "./response";

export interface HookParamsOnConstructRequest {
	request: Request;
	addRequestProperties<
		GenericNewProperties extends Record<string, unknown>,
	>(
		newProperties: GenericNewProperties
	): Request & GenericNewProperties;
}

export type HookOnConstructRequest<
	GenericRequest extends Request = Request,
> = (
	params: HookParamsOnConstructRequest
) => MaybePromise<GenericRequest>;

export const hookRouteExitKind = createCoreLibKind("route-hook-exit");

export interface RouteHookExit extends Kind<typeof hookRouteExitKind.definition> {

}

export const hookRouteNextKind = createCoreLibKind("route-hook-next");

export interface RouteHookNext extends Kind<typeof hookRouteNextKind.definition> {

}

export interface RouteHookParams<
	GenericRequest extends Request = Request,
> {
	readonly request: GenericRequest;
	next(): RouteHookNext;
	exit(): RouteHookExit;
	response<
		GenericCode extends ResponseCode = ResponseCode,
		GenericInformation extends string = string,
		GenericBody extends unknown = unknown,
	>(
		code: GenericCode,
		information: GenericInformation,
		body?: GenericBody,
	): HookResponse<
		GenericCode,
		GenericInformation,
		GenericBody | undefined
	>;
}

export type HookBeforeRouteExecution<
	GenericRequest extends Request = Request,
> = (
	params: RouteHookParams<GenericRequest>
) => MaybePromise<HookResponse | RouteHookExit | RouteHookNext>;

export type HookParseBody<
	GenericRequest extends Request = Request,
> = (
	params: RouteHookParams<GenericRequest>
) => MaybePromise<HookResponse | RouteHookExit | RouteHookNext>;

export interface RouteHookErrorParams<
	GenericRequest extends Request = Request,
> {
	readonly request: GenericRequest;
	readonly error: unknown;
	next(): RouteHookNext;
	exit(): RouteHookExit;
	response<
		GenericCode extends ResponseCode = ResponseCode,
		GenericInformation extends string = string,
		GenericBody extends unknown = unknown,
	>(
		code: GenericCode,
		information: GenericInformation,
		body?: GenericBody,
	): HookResponse<
		GenericCode,
		GenericInformation,
		GenericBody | undefined
	>;
}

export type HookError = (
	params: RouteHookErrorParams<Request>
) => MaybePromise<HookResponse | RouteHookExit | RouteHookNext>;

export interface RouteHookParamsAfter<
	GenericRequest extends Request = Request,
> {
	readonly request: GenericRequest;
	readonly currentResponse: Response;
	next(): RouteHookNext;
	exit(): RouteHookExit;
}

export type HookBeforeSendResponse<
	GenericRequest extends Request = Request,
> = (
	params: RouteHookParamsAfter<GenericRequest>
) => MaybePromise<RouteHookExit | RouteHookNext>;

export type HookSendResponse<
	GenericRequest extends Request = Request,
> = (
	params: RouteHookParamsAfter<GenericRequest>
) => MaybePromise<RouteHookExit | RouteHookNext>;

export type HookAfterSendResponse<
	GenericRequest extends Request = Request,
> = (
	params: RouteHookParamsAfter<GenericRequest>
) => MaybePromise<RouteHookExit | RouteHookNext>;

export interface HookRouteLifeCycle<
	GenericRequest extends Request = Request,
> {
	onConstructRequest?: HookOnConstructRequest<GenericRequest>;
	beforeRouteExecution?: HookBeforeRouteExecution<GenericRequest>;
	parseBody?: HookParseBody<GenericRequest>;
	error?: HookError;
	beforeSendResponse?: HookBeforeSendResponse<GenericRequest>;
	sendResponse?: HookSendResponse<GenericRequest>;
	afterSendResponse?: HookAfterSendResponse<GenericRequest>;
}

export function createHookRouteLifeCycle<
	GenericHookLiveCycle extends Omit<
		HookRouteLifeCycle,
		"onConstructRequest"
	>,
>(
	hookRouteLifeCycle: GenericHookLiveCycle,
): GenericHookLiveCycle;

export function createHookRouteLifeCycle<
	GenericOnConstructRequest extends HookOnConstructRequest,
	GenericHookLiveCycle extends Omit<
		HookRouteLifeCycle<
			Awaited<ReturnType<GenericOnConstructRequest>>
		>,
		"onConstructRequest"
	>,
>(
	onConstructRequest: GenericOnConstructRequest,
	hookRouteLifeCycle: GenericHookLiveCycle,
): SimplifyTopLevel<
	& { onConstructRequest: GenericOnConstructRequest }
	& GenericHookLiveCycle
>;

export function createHookRouteLifeCycle(
	...args: [HookOnConstructRequest, HookRouteLifeCycle]
		| [HookRouteLifeCycle]
) {
	if (args.length === 1) {
		return args[0];
	}

	return {
		...args[1],
		onConstructRequest: args[0],
	};
}

export type ExtractRequestFromHooks<
	GenericHooks extends readonly HookRouteLifeCycle[],
> = GenericHooks extends readonly [
	infer InferredFirst,
	...infer InferredRest extends HookRouteLifeCycle[],
]
	? (
		InferredFirst extends { onConstructRequest: AnyFunction }
			? Awaited<ReturnType<InferredFirst["onConstructRequest"]>>
			: never
	) extends infer InferredResultFirst
		? InferredRest extends readonly []
			? InferredResultFirst
			: ExtractRequestFromHooks<InferredRest> extends infer InferredResultRest
				? InferredResultFirst | InferredResultRest
				: never
		: never
	: never;

export type MakeRequestFromHooks<
	GenericHooks extends readonly HookRouteLifeCycle[],
> = ExtractRequestFromHooks<GenericHooks> extends infer InferredResult extends Request
	? IsEqual<InferredResult, never> extends true
		? never
		: UnionToIntersection<InferredResult>
	: never;
