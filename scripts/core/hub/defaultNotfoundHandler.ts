import { ResponseContract } from "@core/response";
import { createHandlerStep } from "@core/steps";
import { DP } from "@duplojs/utils";

export const defaultNotfoundHandler = createHandlerStep({
	responseContract: ResponseContract.notFound("notfound-route", DP.string()),
	theFunction: (floor, { request, response }) => response(
		"notfound-route",
		`${request.method}:${request.path}` as never,
	),
});
