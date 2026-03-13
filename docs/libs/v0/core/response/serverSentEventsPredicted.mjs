import { createCoreLibKind } from '../kind.mjs';
import './index.mjs';
import { kindHeritage } from '@duplojs/utils';
import { Response } from './base.mjs';

const defaultParamsParent = [undefined, undefined, undefined];
const defaultParams = {};
class ServerSentEventsPredictedResponse extends kindHeritage("server-sent-events-predicted-response", createCoreLibKind("server-sent-events-predicted-response"), Response) {
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

export { ServerSentEventsPredictedResponse };
