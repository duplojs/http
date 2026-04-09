import { createCoreLibKind } from '../kind.mjs';
import './index.mjs';
import { kindHeritage } from '@duplojs/utils';
import { Response } from './base.mjs';

const defaultParamsParent = [undefined, undefined, undefined];
const defaultParams = {};
class StreamTextPredictedResponse extends kindHeritage("stream-text-predicted-response", createCoreLibKind("stream-text-predicted-response"), Response) {
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

export { StreamTextPredictedResponse };
