'use strict';

var kind = require('../kind.cjs');
require('./index.cjs');
var utils = require('@duplojs/utils');
var base = require('./base.cjs');

const defaultParamsParent = [undefined, undefined, undefined];
const defaultParams = {};
class HookResponse extends utils.kindHeritage("hook-response", kind.createCoreLibKind("hook-response"), base.Response) {
    code;
    information;
    body;
    fromHook;
    constructor(from, code, information, body) {
        super(defaultParams, defaultParamsParent);
        this.code = code;
        this.information = information;
        this.body = body;
        this.fromHook = from;
    }
}

exports.HookResponse = HookResponse;
