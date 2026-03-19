import '../response/index.mjs';
import '../steps/index.mjs';
import { createHandlerStep } from '../steps/handler.mjs';
import { ResponseContract } from '../response/contract.mjs';

const defaultMalformedUrlHandler = createHandlerStep({
    responseContract: ResponseContract.badRequest("malformed-url"),
    theFunction: (__, { response }) => response("malformed-url", undefined),
    metadata: [],
});

export { defaultMalformedUrlHandler };
