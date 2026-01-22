import { createCoreLibKind } from '../kind.mjs';
import './index.mjs';
import { kindHeritage } from '@duplojs/utils';
import { Response } from './base.mjs';

const defaultParamsParent = [undefined, undefined, undefined];
const defaultParams = {};
class PredictedResponse extends kindHeritage("predicted-response", createCoreLibKind("predicted-response"), Response) {
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

export { PredictedResponse };
