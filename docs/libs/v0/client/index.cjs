'use strict';

require('./types/index.cjs');
var kind = require('./kind.cjs');
var httpClient = require('./httpClient.cjs');
var hooks = require('./hooks.cjs');
var getBody = require('./getBody.cjs');
var insertParamsInPath = require('./insertParamsInPath.cjs');
var queryToString = require('./queryToString.cjs');
var promiseRequest = require('./promiseRequest.cjs');
var unexpectedResponseError = require('./unexpectedResponseError.cjs');



exports.createClientKind = kind.createClientKind;
exports.createHttpClient = httpClient.createHttpClient;
exports.httpClientKind = httpClient.httpClientKind;
exports.launchCodeHook = hooks.launchCodeHook;
exports.launchErrorHook = hooks.launchErrorHook;
exports.launchExpectedResponseHook = hooks.launchExpectedResponseHook;
exports.launchInformationHook = hooks.launchInformationHook;
exports.launchNotPredictedHook = hooks.launchNotPredictedHook;
exports.launchRequestHook = hooks.launchRequestHook;
exports.launchResponseHook = hooks.launchResponseHook;
exports.launchResponseTypeHook = hooks.launchResponseTypeHook;
exports.getBody = getBody.getBody;
exports.insertParamsInPath = insertParamsInPath.insertParamsInPath;
exports.queryToString = queryToString.queryToString;
exports.PromiseRequest = promiseRequest.PromiseRequest;
exports.UnexpectedCodeResponseError = unexpectedResponseError.UnexpectedCodeResponseError;
exports.UnexpectedInformationResponseError = unexpectedResponseError.UnexpectedInformationResponseError;
exports.UnexpectedResponseError = unexpectedResponseError.UnexpectedResponseError;
exports.UnexpectedResponseTypeError = unexpectedResponseError.UnexpectedResponseTypeError;
