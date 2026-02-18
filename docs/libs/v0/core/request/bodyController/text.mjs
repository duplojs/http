import { stringToBytes } from '@duplojs/utils';
import { createBodyController } from './base.mjs';

const TextBodyController = createBodyController("text");
function controlBodyAsText(params) {
    return TextBodyController.create({
        bodyMaxSize: params?.bodyMaxSize && stringToBytes(params.bodyMaxSize),
    });
}

export { TextBodyController, controlBodyAsText };
