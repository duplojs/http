'use strict';

var utils = require('@duplojs/utils');
var getBody = require('./getBody.cjs');
var insertParamsInPath = require('./insertParamsInPath.cjs');
var queryToString = require('./queryToString.cjs');
var hooks = require('./hooks.cjs');
var EE = require('@duplojs/utils/either');
var SS = require('@duplojs/utils/string');
var AA = require('@duplojs/utils/array');
var unexpectedResponseError = require('./unexpectedResponseError.cjs');
var serverSentEvents = require('./serverSentEvents.cjs');
var clientCache = require('./clientCache.cjs');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var EE__namespace = /*#__PURE__*/_interopNamespaceDefault(EE);
var SS__namespace = /*#__PURE__*/_interopNamespaceDefault(SS);
var AA__namespace = /*#__PURE__*/_interopNamespaceDefault(AA);

class PromiseRequest extends Promise {
    params;
    hooks = {};
    constructor(params) {
        super((resolve) => void EE__namespace
            .rightAsyncPipe(Promise.resolve(params), (params) => hooks.launchRequestHook(params.hooks.request, this.hooks.request ?? [], params), PromiseRequest.fetch, (response) => hooks.launchResponseHook(params.hooks.response, this.hooks.response ?? [], response), async (response) => {
            if (params.disabledPredicateMode === false && response.predicted === false) {
                await hooks.launchNotPredictedHook(params.hooks.notPredictedResponse, this.hooks.notPredictedResponse ?? [], response);
                return EE__namespace.right("response", response);
            }
            if (SS__namespace.startsWith(response.code, "1")) {
                await hooks.launchResponseTypeHook(params.hooks.informationalResponseType, this.hooks.informationalResponseType ?? [], response);
            }
            else if (SS__namespace.startsWith(response.code, "2")) {
                await hooks.launchResponseTypeHook(params.hooks.successfulResponseType, this.hooks.successfulResponseType ?? [], response);
                await hooks.launchExpectedResponseHook(params.hooks.expectedResponse, this.hooks.expectedResponse ?? [], response);
            }
            else if (SS__namespace.startsWith(response.code, "3")) {
                await hooks.launchResponseTypeHook(params.hooks.redirectionResponseType, this.hooks.redirectionResponseType ?? [], response);
            }
            else if (SS__namespace.startsWith(response.code, "4")) {
                await hooks.launchResponseTypeHook(params.hooks.clientErrorResponseType, this.hooks.clientErrorResponseType ?? [], response);
                await hooks.launchExpectedResponseHook(params.hooks.expectedResponse, this.hooks.expectedResponse ?? [], response);
            }
            else if (SS__namespace.startsWith(response.code, "5")) {
                await hooks.launchResponseTypeHook(params.hooks.serverErrorResponseType, this.hooks.serverErrorResponseType ?? [], response);
            }
            if (response.information !== undefined) {
                await hooks.launchInformationHook(params.hooks.information[response.information] ?? [], this.hooks.information?.[response.information] ?? [], response);
            }
            await hooks.launchCodeHook(params.hooks.code[response.code] ?? [], this.hooks.code?.[response.code] ?? [], response);
            return EE__namespace.right("response", response);
        })
            .then(async (result) => {
            if (EE__namespace.futureErrorKind.has(result)) {
                const error = utils.unwrap(result);
                await hooks.launchErrorHook(params.hooks.error, this.hooks.error ?? [], error, params);
                return EE__namespace.left("request-error", {
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
        const formattedInformation = AA__namespace.coalescing(information);
        formattedInformation.forEach((information) => {
            this.hooks.information ??= {};
            this.hooks.information[information] ??= [];
            this.hooks.information[information].push(callback);
        });
        return this;
    }
    whenCode(code, callback) {
        const formattedCode = AA__namespace.coalescing(code);
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
        void this.then(EE__namespace.whenIsRight((response) => {
            if ((response.predicted === true
                || response.requestParams.disabledPredicateMode === true)
                && Symbol.asyncIterator in response) {
                response.onReceiveEvent(eventName, callback);
            }
        }));
        return this;
    }
    iWantInformation(information) {
        const formattedInformation = AA__namespace.coalescing(information);
        return this.then(EE__namespace.whenIsRight((response) => {
            if ((response.predicted === true
                || response.requestParams.disabledPredicateMode === true)
                && response.information !== undefined
                && AA__namespace.includes(formattedInformation, response.information)) {
                return EE__namespace.right("response", response);
            }
            return EE__namespace.left("unexpect-response", response);
        }));
    }
    iWantCode(code) {
        const formattedCode = AA__namespace.coalescing(code);
        return this.then(EE__namespace.whenIsRight((response) => {
            if ((response.predicted === true
                || response.requestParams.disabledPredicateMode === true)
                && AA__namespace.includes(formattedCode, response.code)) {
                return EE__namespace.right("response", response);
            }
            return EE__namespace.left("unexpect-response", response);
        }));
    }
    iWantInformationalResponse() {
        return this.then(EE__namespace.whenIsRight((response) => {
            if ((response.predicted === true
                || response.requestParams.disabledPredicateMode === true)
                && SS__namespace.startsWith(response.code, "1")) {
                return EE__namespace.right("response", response);
            }
            return EE__namespace.left("unexpect-response", response);
        }));
    }
    iWantSuccessfulResponse() {
        return this.then(EE__namespace.whenIsRight((response) => {
            if ((response.predicted === true
                || response.requestParams.disabledPredicateMode === true)
                && SS__namespace.startsWith(response.code, "2")) {
                return EE__namespace.right("response", response);
            }
            return EE__namespace.left("unexpect-response", response);
        }));
    }
    iWantRedirectionResponse() {
        return this.then(EE__namespace.whenIsRight((response) => {
            if ((response.predicted === true
                || response.requestParams.disabledPredicateMode === true)
                && SS__namespace.startsWith(response.code, "3")) {
                return EE__namespace.right("response", response);
            }
            return EE__namespace.left("unexpect-response", response);
        }));
    }
    iWantClientErrorResponse() {
        return this.then(EE__namespace.whenIsRight((response) => {
            if ((response.predicted === true
                || response.requestParams.disabledPredicateMode === true)
                && SS__namespace.startsWith(response.code, "4")) {
                return EE__namespace.right("response", response);
            }
            return EE__namespace.left("unexpect-response", response);
        }));
    }
    iWantServerErrorResponse() {
        return this.then(EE__namespace.whenIsRight((response) => {
            if ((response.predicted === true
                || response.requestParams.disabledPredicateMode === true)
                && SS__namespace.startsWith(response.code, "5")) {
                return EE__namespace.right("response", response);
            }
            return EE__namespace.left("unexpect-response", response);
        }));
    }
    iWantExpectedResponse() {
        return this.then(EE__namespace.whenIsRight((response) => {
            if ((response.predicted === true
                || response.requestParams.disabledPredicateMode === true)
                && (SS__namespace.startsWith(response.code, "2")
                    || SS__namespace.startsWith(response.code, "4"))) {
                return EE__namespace.right("response", response);
            }
            return EE__namespace.left("unexpect-response", response);
        }));
    }
    iSelectExpectedResponseByInformation(selector) {
        return this.then(EE__namespace.whenIsRight((response) => {
            if ((response.predicted === true
                || response.requestParams.disabledPredicateMode === true)
                && selector[(response.information ?? "")] === true) {
                return EE__namespace.right("response", response);
            }
            return EE__namespace.left("unexpect-response", response);
        }));
    }
    iWantInformationOrThrow(information) {
        return this
            .iWantInformation(information)
            .then((maybeResponse) => {
            if (EE__namespace.isRight(maybeResponse)) {
                return utils.unwrap(maybeResponse);
            }
            throw new unexpectedResponseError.UnexpectedInformationResponseError(information, utils.unwrap(maybeResponse));
        });
    }
    iWantCodeOrThrow(code) {
        return this
            .iWantCode(code)
            .then((maybeResponse) => {
            if (EE__namespace.isRight(maybeResponse)) {
                return utils.unwrap(maybeResponse);
            }
            throw new unexpectedResponseError.UnexpectedCodeResponseError(code, utils.unwrap(maybeResponse));
        });
    }
    iWantInformationalResponseOrThrow() {
        return this
            .iWantInformationalResponse()
            .then((maybeResponse) => {
            if (EE__namespace.isRight(maybeResponse)) {
                return utils.unwrap(maybeResponse);
            }
            throw new unexpectedResponseError.UnexpectedResponseTypeError("informational", utils.unwrap(maybeResponse));
        });
    }
    iWantSuccessfulResponseOrThrow() {
        return this
            .iWantSuccessfulResponse()
            .then((maybeResponse) => {
            if (EE__namespace.isRight(maybeResponse)) {
                return utils.unwrap(maybeResponse);
            }
            throw new unexpectedResponseError.UnexpectedResponseTypeError("successful", utils.unwrap(maybeResponse));
        });
    }
    iWantRedirectionResponseOrThrow() {
        return this
            .iWantRedirectionResponse()
            .then((maybeResponse) => {
            if (EE__namespace.isRight(maybeResponse)) {
                return utils.unwrap(maybeResponse);
            }
            throw new unexpectedResponseError.UnexpectedResponseTypeError("redirection", utils.unwrap(maybeResponse));
        });
    }
    iWantClientErrorResponseOrThrow() {
        return this
            .iWantClientErrorResponse()
            .then((maybeResponse) => {
            if (EE__namespace.isRight(maybeResponse)) {
                return utils.unwrap(maybeResponse);
            }
            throw new unexpectedResponseError.UnexpectedResponseTypeError("clientError", utils.unwrap(maybeResponse));
        });
    }
    iWantServerErrorResponseOrThrow() {
        return this
            .iWantServerErrorResponse()
            .then((maybeResponse) => {
            if (EE__namespace.isRight(maybeResponse)) {
                return utils.unwrap(maybeResponse);
            }
            throw new unexpectedResponseError.UnexpectedResponseTypeError("informational", utils.unwrap(maybeResponse));
        });
    }
    iWantExpectedResponseOrThrow() {
        return this
            .iWantExpectedResponse()
            .then((maybeResponse) => {
            if (EE__namespace.isRight(maybeResponse)) {
                return utils.unwrap(maybeResponse);
            }
            throw new unexpectedResponseError.UnexpectedResponseError(utils.unwrap(maybeResponse));
        });
    }
    iSelectExpectedResponseByInformationOrThrow(selector) {
        return this
            .iSelectExpectedResponseByInformation(selector)
            .then((maybeResponse) => {
            if (EE__namespace.isRight(maybeResponse)) {
                return utils.unwrap(maybeResponse);
            }
            throw new unexpectedResponseError.UnexpectedResponseError(utils.unwrap(maybeResponse));
        });
    }
    static get [Symbol.species]() {
        return Promise;
    }
    static fetch(requestParams) {
        const cachedResponse = clientCache.findResponseFromCacheStore(requestParams);
        if (cachedResponse) {
            return Promise.resolve(EE__namespace.right("response", cachedResponse));
        }
        const path = insertParamsInPath.insertParamsInPath(requestParams.path, requestParams.params);
        const query = queryToString.queryToString(requestParams.query);
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
                else if (body instanceof utils.TheFormData) {
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
            .then((response) => getBody.getBody(response)
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
                return EE__namespace.right("response", serverSentEvents.makeClientEventsResponse(clientResponse, fetchUrl, fetchInitParams));
            }
            if (clientResponse.code.startsWith("2")) {
                clientCache.saveResponseInCacheStore(requestParams, clientResponse);
            }
            return EE__namespace.right("response", clientResponse);
        }))
            .catch((error) => EE__namespace.left("request-error", {
            error,
            requestParams,
        }));
    }
}

exports.PromiseRequest = PromiseRequest;
