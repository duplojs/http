'use strict';

var kind = require('../kind.cjs');
require('./index.cjs');
var utils = require('@duplojs/utils');
var base = require('./base.cjs');

const defaultParamsParent = [undefined, undefined, undefined];
const defaultParams = {};
class ServerSentEventsPredictedResponse extends utils.kindHeritage("server-sent-events-predicted-response", kind.createCoreLibKind("server-sent-events-predicted-response"), base.Response) {
    startSendingEvents;
    code;
    information;
    body = undefined;
    constructor(code, information, startSendingEvents) {
        super(defaultParams, defaultParamsParent);
        this.startSendingEvents = startSendingEvents;
        this.code = code;
        this.information = information;
    }
}

exports.ServerSentEventsPredictedResponse = ServerSentEventsPredictedResponse;
