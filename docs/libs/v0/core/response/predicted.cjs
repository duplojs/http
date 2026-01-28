'use strict';

var kind = require('../kind.cjs');
require('./index.cjs');
var utils = require('@duplojs/utils');
var base = require('./base.cjs');

const defaultParamsParent = [undefined, undefined, undefined];
const defaultParams = {};
class PredictedResponse extends utils.kindHeritage("predicted-response", kind.createCoreLibKind("predicted-response"), base.Response) {
    code;
    information;
    body;
    constructor(code, information, body) {
        super(defaultParams, defaultParamsParent);
        this.code = code;
        this.information = information;
        this.body = body;
    }
}

exports.PredictedResponse = PredictedResponse;
