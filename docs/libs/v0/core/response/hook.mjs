import { createCoreLibKind } from '../kind.mjs';
import './index.mjs';
import { kindHeritage } from '@duplojs/utils';
import { Response } from './base.mjs';

const defaultParamsParent = [undefined, undefined, undefined];
const defaultParams = {};
class HookResponse extends kindHeritage("hook-response", createCoreLibKind("hook-response"), Response) {
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

export { HookResponse };
