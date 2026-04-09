'use strict';

var kind = require('../kind.cjs');
require('./index.cjs');
var utils = require('@duplojs/utils');
var base = require('./base.cjs');

const defaultParamsParent = [undefined, undefined, undefined];
const defaultParams = {};
class StreamPredictedResponse extends utils.kindHeritage("stream-predicted-response", kind.createCoreLibKind("stream-predicted-response"), base.Response) {
    startStream;
    code;
    information;
    body = undefined;
    constructor(code, information, startStream) {
        super(defaultParams, defaultParamsParent);
        this.startStream = startStream;
        this.code = code;
        this.information = information;
    }
}

exports.StreamPredictedResponse = StreamPredictedResponse;
