import '../response/index.mjs';
import '../steps/index.mjs';
import { DP } from '@duplojs/utils';
import { createHandlerStep } from '../steps/handler.mjs';
import { ResponseContract } from '../response/contract.mjs';

const defaultNotfoundHandler = createHandlerStep({
    responseContract: ResponseContract.notFound("notfound-route", DP.string()),
    theFunction: (floor, { request, response }) => response("notfound-route", `${request.method}:${request.path}`),
    metadata: [],
});

export { defaultNotfoundHandler };
