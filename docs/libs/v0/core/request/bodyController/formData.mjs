import { stringToBytes, toRegExp } from '@duplojs/utils';
import { createBodyController } from './base.mjs';

const FormDataBodyController = createBodyController("formData");
function controlBodyAsFormData(params) {
    return FormDataBodyController.create({
        maxFileQuantity: params.maxFileQuantity,
        bodyMaxSize: params.bodyMaxSize && stringToBytes(params.bodyMaxSize),
        fileMaxSize: params.fileMaxSize && stringToBytes(params.fileMaxSize),
        textFieldMaxSize: params.textFieldMaxSize && stringToBytes(params.textFieldMaxSize),
        mimeType: params.mimeType !== undefined
            ? toRegExp(params.mimeType)
            : undefined,
        maxBufferSize: params.maxBufferSize !== undefined
            ? stringToBytes(params.maxBufferSize)
            : stringToBytes("128kb"),
        maxIndexArray: params.maxIndexArray !== undefined
            ? params.maxIndexArray
            : 500,
        maxKeyLength: params.maxKeyLength !== undefined
            ? params.maxKeyLength
            : 500,
    });
}

export { FormDataBodyController, controlBodyAsFormData };
