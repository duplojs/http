import { unwrap, TheFormData } from '@duplojs/utils';
import { getBody } from './getBody.mjs';
import { insertParamsInPath } from './insertParamsInPath.mjs';
import { queryToString } from './queryToString.mjs';
import { launchRequestHook, launchResponseHook, launchNotPredictedHook, launchResponseTypeHook, launchExpectedResponseHook, launchInformationHook, launchCodeHook, launchErrorHook } from './hooks.mjs';
import * as EE from '@duplojs/utils/either';
import * as SS from '@duplojs/utils/string';
import * as AA from '@duplojs/utils/array';
import { UnexpectedInformationResponseError, UnexpectedCodeResponseError, UnexpectedResponseTypeError, UnexpectedResponseError } from './unexpectedResponseError.mjs';
import { makeClientEventsResponse } from './serverSentEvents.mjs';

class PromiseRequest extends Promise {
    params;
    hooks = {};
    constructor(params) {
        super((resolve) => void EE
            .rightAsyncPipe(Promise.resolve(params), (params) => launchRequestHook(params.hooks.request, this.hooks.request ?? [], params), PromiseRequest.fetch, (response) => launchResponseHook(params.hooks.response, this.hooks.response ?? [], response), async (response) => {
            if (params.disabledPredicateMode === false && response.predicted === false) {
                await launchNotPredictedHook(params.hooks.notPredictedResponse, this.hooks.notPredictedResponse ?? [], response);
                return EE.right("response", response);
            }
            if (SS.startsWith(response.code, "1")) {
                await launchResponseTypeHook(params.hooks.informationalResponseType, this.hooks.informationalResponseType ?? [], response);
            }
            else if (SS.startsWith(response.code, "2")) {
                await launchResponseTypeHook(params.hooks.successfulResponseType, this.hooks.successfulResponseType ?? [], response);
                await launchExpectedResponseHook(params.hooks.expectedResponse, this.hooks.expectedResponse ?? [], response);
            }
            else if (SS.startsWith(response.code, "3")) {
                await launchResponseTypeHook(params.hooks.redirectionResponseType, this.hooks.redirectionResponseType ?? [], response);
            }
            else if (SS.startsWith(response.code, "4")) {
                await launchResponseTypeHook(params.hooks.clientErrorResponseType, this.hooks.clientErrorResponseType ?? [], response);
                await launchExpectedResponseHook(params.hooks.expectedResponse, this.hooks.expectedResponse ?? [], response);
            }
            else if (SS.startsWith(response.code, "5")) {
                await launchResponseTypeHook(params.hooks.serverErrorResponseType, this.hooks.serverErrorResponseType ?? [], response);
            }
            if (response.information !== undefined) {
                await launchInformationHook(params.hooks.information[response.information] ?? [], this.hooks.information?.[response.information] ?? [], response);
            }
            await launchCodeHook(params.hooks.code[response.code] ?? [], this.hooks.code?.[response.code] ?? [], response);
            return EE.right("response", response);
        })
            .then(async (result) => {
            if (EE.futureErrorKind.has(result)) {
                const error = unwrap(result);
                await launchErrorHook(params.hooks.error, this.hooks.error ?? [], error, params);
                return EE.left("request-error", {
                    error,
                    requestParams: params,
                });
            }
            return result;
        })
            .then(resolve));
        this.params = params;
    }
    addRequestInterceptor(callback) {
        this.hooks.request ??= [];
        this.hooks.request.push(callback);
        return this;
    }
    addResponseInterceptor(callback) {
        this.hooks.response ??= [];
        this.hooks.response.push(callback);
        return this;
    }
    whenNotPredictedResponse(callback) {
        this.hooks.notPredictedResponse ??= [];
        this.hooks.notPredictedResponse.push(callback);
        return this;
    }
    whenInformation(information, callback) {
        const formattedInformation = AA.coalescing(information);
        formattedInformation.forEach((information) => {
            this.hooks.information ??= {};
            this.hooks.information[information] ??= [];
            this.hooks.information[information].push(callback);
        });
        return this;
    }
    whenCode(code, callback) {
        const formattedCode = AA.coalescing(code);
        formattedCode.forEach((code) => {
            this.hooks.code ??= {};
            this.hooks.code[code] ??= [];
            this.hooks.code[code].push(callback);
        });
        return this;
    }
    whenInformationalResponse(callback) {
        this.hooks.informationalResponseType ??= [];
        this.hooks.informationalResponseType.push(callback);
        return this;
    }
    whenSuccessfulResponse(callback) {
        this.hooks.successfulResponseType ??= [];
        this.hooks.successfulResponseType.push(callback);
        return this;
    }
    whenRedirectionResponse(callback) {
        this.hooks.redirectionResponseType ??= [];
        this.hooks.redirectionResponseType.push(callback);
        return this;
    }
    whenClientErrorResponse(callback) {
        this.hooks.clientErrorResponseType ??= [];
        this.hooks.clientErrorResponseType.push(callback);
        return this;
    }
    whenServerErrorResponse(callback) {
        this.hooks.serverErrorResponseType ??= [];
        this.hooks.serverErrorResponseType.push(callback);
        return this;
    }
    whenExpectedResponse(callback) {
        this.hooks.expectedResponse ??= [];
        this.hooks.expectedResponse.push(callback);
        return this;
    }
    whenError(callback) {
        this.hooks.error ??= [];
        this.hooks.error.push(callback);
        return this;
    }
    whenReceiveServerEvent(eventName, callback) {
        void this.then(EE.whenIsRight((response) => {
            if ((response.predicted === true
                || response.requestParams.disabledPredicateMode === true)
                && Symbol.asyncIterator in response) {
                response.onReceiveEvent(eventName, callback);
            }
        }));
        return this;
    }
    iWantInformation(information) {
        const formattedInformation = AA.coalescing(information);
        return this.then(EE.whenIsRight((response) => {
            if ((response.predicted === true
                || response.requestParams.disabledPredicateMode === true)
                && response.information !== undefined
                && AA.includes(formattedInformation, response.information)) {
                return EE.right("response", response);
            }
            return EE.left("unexpect-response", response);
        }));
    }
    iWantCode(code) {
        const formattedCode = AA.coalescing(code);
        return this.then(EE.whenIsRight((response) => {
            if ((response.predicted === true
                || response.requestParams.disabledPredicateMode === true)
                && AA.includes(formattedCode, response.code)) {
                return EE.right("response", response);
            }
            return EE.left("unexpect-response", response);
        }));
    }
    iWantInformationalResponse() {
        return this.then(EE.whenIsRight((response) => {
            if ((response.predicted === true
                || response.requestParams.disabledPredicateMode === true)
                && SS.startsWith(response.code, "1")) {
                return EE.right("response", response);
            }
            return EE.left("unexpect-response", response);
        }));
    }
    iWantSuccessfulResponse() {
        return this.then(EE.whenIsRight((response) => {
            if ((response.predicted === true
                || response.requestParams.disabledPredicateMode === true)
                && SS.startsWith(response.code, "2")) {
                return EE.right("response", response);
            }
            return EE.left("unexpect-response", response);
        }));
    }
    iWantRedirectionResponse() {
        return this.then(EE.whenIsRight((response) => {
            if ((response.predicted === true
                || response.requestParams.disabledPredicateMode === true)
                && SS.startsWith(response.code, "3")) {
                return EE.right("response", response);
            }
            return EE.left("unexpect-response", response);
        }));
    }
    iWantClientErrorResponse() {
        return this.then(EE.whenIsRight((response) => {
            if ((response.predicted === true
                || response.requestParams.disabledPredicateMode === true)
                && SS.startsWith(response.code, "4")) {
                return EE.right("response", response);
            }
            return EE.left("unexpect-response", response);
        }));
    }
    iWantServerErrorResponse() {
        return this.then(EE.whenIsRight((response) => {
            if ((response.predicted === true
                || response.requestParams.disabledPredicateMode === true)
                && SS.startsWith(response.code, "5")) {
                return EE.right("response", response);
            }
            return EE.left("unexpect-response", response);
        }));
    }
    iWantExpectedResponse() {
        return this.then(EE.whenIsRight((response) => {
            if ((response.predicted === true
                || response.requestParams.disabledPredicateMode === true)
                && (SS.startsWith(response.code, "2")
                    || SS.startsWith(response.code, "4"))) {
                return EE.right("response", response);
            }
            return EE.left("unexpect-response", response);
        }));
    }
    iSelectExpectedResponseByInformation(selector) {
        return this.then(EE.whenIsRight((response) => {
            if ((response.predicted === true
                || response.requestParams.disabledPredicateMode === true)
                && selector[(response.information ?? "")] === true) {
                return EE.right("response", response);
            }
            return EE.left("unexpect-response", response);
        }));
    }
    iWantInformationOrThrow(information) {
        return this
            .iWantInformation(information)
            .then((maybeResponse) => {
            if (EE.isRight(maybeResponse)) {
                return unwrap(maybeResponse);
            }
            throw new UnexpectedInformationResponseError(information, unwrap(maybeResponse));
        });
    }
    iWantCodeOrThrow(code) {
        return this
            .iWantCode(code)
            .then((maybeResponse) => {
            if (EE.isRight(maybeResponse)) {
                return unwrap(maybeResponse);
            }
            throw new UnexpectedCodeResponseError(code, unwrap(maybeResponse));
        });
    }
    iWantInformationalResponseOrThrow() {
        return this
            .iWantInformationalResponse()
            .then((maybeResponse) => {
            if (EE.isRight(maybeResponse)) {
                return unwrap(maybeResponse);
            }
            throw new UnexpectedResponseTypeError("informational", unwrap(maybeResponse));
        });
    }
    iWantSuccessfulResponseOrThrow() {
        return this
            .iWantSuccessfulResponse()
            .then((maybeResponse) => {
            if (EE.isRight(maybeResponse)) {
                return unwrap(maybeResponse);
            }
            throw new UnexpectedResponseTypeError("successful", unwrap(maybeResponse));
        });
    }
    iWantRedirectionResponseOrThrow() {
        return this
            .iWantRedirectionResponse()
            .then((maybeResponse) => {
            if (EE.isRight(maybeResponse)) {
                return unwrap(maybeResponse);
            }
            throw new UnexpectedResponseTypeError("redirection", unwrap(maybeResponse));
        });
    }
    iWantClientErrorResponseOrThrow() {
        return this
            .iWantClientErrorResponse()
            .then((maybeResponse) => {
            if (EE.isRight(maybeResponse)) {
                return unwrap(maybeResponse);
            }
            throw new UnexpectedResponseTypeError("clientError", unwrap(maybeResponse));
        });
    }
    iWantServerErrorResponseOrThrow() {
        return this
            .iWantServerErrorResponse()
            .then((maybeResponse) => {
            if (EE.isRight(maybeResponse)) {
                return unwrap(maybeResponse);
            }
            throw new UnexpectedResponseTypeError("informational", unwrap(maybeResponse));
        });
    }
    iWantExpectedResponseOrThrow() {
        return this
            .iWantExpectedResponse()
            .then((maybeResponse) => {
            if (EE.isRight(maybeResponse)) {
                return unwrap(maybeResponse);
            }
            throw new UnexpectedResponseError(unwrap(maybeResponse));
        });
    }
    iSelectExpectedResponseByInformationOrThrow(selector) {
        return this
            .iSelectExpectedResponseByInformation(selector)
            .then((maybeResponse) => {
            if (EE.isRight(maybeResponse)) {
                return unwrap(maybeResponse);
            }
            throw new UnexpectedResponseError(unwrap(maybeResponse));
        });
    }
    static get [Symbol.species]() {
        return Promise;
    }
    static fetch(requestParams) {
        const path = insertParamsInPath(requestParams.path, requestParams.params);
        const query = queryToString(requestParams.query);
        const url = query
            ? `${path}?${query}`
            : path;
        const headers = { ...requestParams.headers };
        let body = requestParams.body;
        if (body) {
            if (!headers["content-type"]) {
                if (typeof body === "string") {
                    headers["content-type"] = "text/plain; charset=utf-8";
                    body = body.toString();
                }
                else if (body instanceof TheFormData) {
                    headers["content-type-options"] = "advanced";
                }
                else if ((body
                    && typeof body === "object"
                    && body?.constructor?.name === "Object")
                    || (body instanceof Array
                        && body?.constructor?.name === "Array")
                    || body === null
                    || typeof body === "boolean"
                    || typeof body === "number") {
                    headers["content-type"] = "application/json; charset=utf-8";
                    body = JSON.stringify(body);
                }
            }
        }
        const fetchUrl = `${requestParams.baseUrl}${url}`;
        const fetchInitParams = {
            ...requestParams.initParams,
            headers: headers,
            method: requestParams.method,
            body: body,
            signal: requestParams.abortController.signal,
        };
        return fetch(fetchUrl, fetchInitParams)
            .then((response) => getBody(response)
            .then((body) => {
            const clientResponse = {
                body,
                information: response.headers.get(requestParams.informationHeaderKey) ?? undefined,
                code: response.status.toString(),
                ok: (response.status < 500)
                    ? response.ok
                    : null,
                headers: response.headers,
                type: response.type,
                url: response.url,
                redirected: response.redirected,
                raw: response,
                requestParams,
                predicted: response.headers.get(requestParams.predictedHeaderKey) !== null,
            };
            if (response.headers.get("content-type")?.includes("text/event-stream")) {
                return EE.right("response", makeClientEventsResponse(clientResponse, fetchUrl, fetchInitParams));
            }
            return EE.right("response", clientResponse);
        }))
            .catch((error) => EE.left("request-error", {
            error,
            requestParams,
        }));
    }
}

export { PromiseRequest };
