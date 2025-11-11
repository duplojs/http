import { type Request } from "../../request";
import { createCoreLibKind } from "../../kind";
import { type UnionToIntersection, type AnyFunction, type Kind, type MaybePromise, type SimplifyTopLevel, type IsEqual } from "@duplojs/utils";
import { type HookResponse } from "./response";
import { type ResponseCode } from "@core/response";

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

export const routeExitKind = createCoreLibKind("route-hook-exit");

interface HookExit extends Kind<typeof routeExitKind.definition> {

}

export interface RouteHookParams<
	GenericRequest extends Request = Request,
> {
	readonly request: GenericRequest;
	next(): MaybePromise<HookExit | HookResponse>;
	exit(): HookExit;
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
		GenericBody
	>;
}

export type HookBeforeRouteExecution<
	GenericRequest extends Request = Request,
> = (
	params: RouteHookParams<GenericRequest>
) => MaybePromise<HookResponse | HookExit>;

export type HookParseBody<
	GenericRequest extends Request = Request,
> = (
	params: RouteHookParams<GenericRequest>
) => MaybePromise<HookResponse | HookExit>;

export type HookError = (
	params: RouteHookParams<Request>
) => MaybePromise<HookResponse | HookExit>;

export interface RouteHookParamsAfter<
	GenericRequest extends Request = Request,
> {
	readonly request: GenericRequest;
	next(): MaybePromise<HookExit>;
	exit(): HookExit;
}

export type HookBeforeSendResponse<
	GenericRequest extends Request = Request,
> = (
	params: RouteHookParamsAfter<GenericRequest>
) => MaybePromise<HookExit>;

export type HookSendResponse<
	GenericRequest extends Request = Request,
> = (
	params: RouteHookParamsAfter<GenericRequest>
) => MaybePromise<HookExit>;

export type HookAfterSendResponse<
	GenericRequest extends Request = Request,
> = (
	params: RouteHookParamsAfter<GenericRequest>
) => MaybePromise<HookExit>;

export interface HookRouteLifeCycle<
	GenericRequest extends Request = Request,
> {
	onConstructRequest?: HookOnConstructRequest<GenericRequest>;
	beforeRouteExecution?: HookBeforeRouteExecution<GenericRequest>;
	parseBody?: HookParseBody<GenericRequest>;
	parseError?: HookError;
	beforeSendResponse?: HookBeforeSendResponse<GenericRequest>;
	sendResponse?: HookSendResponse<GenericRequest>;
	afterSendResponse?: HookAfterSendResponse<GenericRequest>;
}

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

export function createHookRouteLifeCycle<
	GenericHookLiveCycle extends Omit<
		HookRouteLifeCycle,
		"onConstructRequest"
	>,
>(
	hookRouteLifeCycle: GenericHookLiveCycle,
): GenericHookLiveCycle;

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
