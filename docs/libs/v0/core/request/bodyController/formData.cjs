'use strict';

var utils = require('@duplojs/utils');
var base = require('./base.cjs');

const FormDataBodyController = base.createBodyController("formData");
function controlBodyAsFormData(params) {
    return FormDataBodyController.create({
        maxFileQuantity: params.maxFileQuantity,
        bodyMaxSize: params.bodyMaxSize && utils.stringToBytes(params.bodyMaxSize),
        fileMaxSize: params.fileMaxSize && utils.stringToBytes(params.fileMaxSize),
        mimeType: params.mimeType !== undefined
            ? utils.toRegExp(params.mimeType)
            : undefined,
        maxBufferSize: params.maxBufferSize !== undefined
            ? utils.stringToBytes(params.maxBufferSize)
            : utils.stringToBytes("128kb"),
        maxIndexArray: params.maxIndexArray !== undefined
            ? params.maxIndexArray
            : 500,
        maxKeyLength: params.maxKeyLength !== undefined
            ? params.maxKeyLength
            : 500,
    });
}

exports.FormDataBodyController = FormDataBodyController;
exports.controlBodyAsFormData = controlBodyAsFormData;
