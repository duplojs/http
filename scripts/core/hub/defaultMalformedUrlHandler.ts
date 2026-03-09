import { ResponseContract } from "@core/response";
import { createHandlerStep } from "@core/steps";

export const defaultMalformedUrlHandler = createHandlerStep({
	responseContract: ResponseContract.badRequest("malformed-url"),
	theFunction: (__, { response }) => response(
		"malformed-url",
		undefined as never,
	),
	metadata: [],
});
