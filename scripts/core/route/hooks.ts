import { type Request } from "../request";
import { createCoreLibKind } from "../kind";
import { type Kind, type MaybePromise } from "@duplojs/utils";
import { type HookResponse } from "../response";
import { type ResponseCode, type Response } from "@core/response";

export const hookRouteExitKind = createCoreLibKind("route-hook-exit");

export interface RouteHookExit extends Kind<typeof hookRouteExitKind.definition> {

}

export const hookRouteNextKind = createCoreLibKind("route-hook-next");

export interface RouteHookNext extends Kind<typeof hookRouteNextKind.definition> {

}

export interface RouteHookParams {
	readonly request: Request;
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

export type HookBeforeRouteExecution = (
	params: RouteHookParams,
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

export interface RouteHookParamsAfter {
	readonly request: Request;
	readonly currentResponse: Response;
	next(): RouteHookNext;
	exit(): RouteHookExit;
}

export type HookBeforeSendResponse = (
	params: RouteHookParamsAfter
) => MaybePromise<RouteHookExit | RouteHookNext>;

export type HookSendResponse = (
	params: RouteHookParamsAfter
) => MaybePromise<RouteHookExit | RouteHookNext>;

export type HookAfterSendResponse = (
	params: RouteHookParamsAfter
) => MaybePromise<RouteHookExit | RouteHookNext>;

export interface HookRouteLifeCycle {
	beforeRouteExecution?: HookBeforeRouteExecution;
	error?: HookError;
	beforeSendResponse?: HookBeforeSendResponse;
	sendResponse?: HookSendResponse;
	afterSendResponse?: HookAfterSendResponse;
}

export function createHookRouteLifeCycle<
	const GenericHookLiveCycle extends HookRouteLifeCycle,
>(
	hookRouteLifeCycle: GenericHookLiveCycle,
) {
	return hookRouteLifeCycle;
}
