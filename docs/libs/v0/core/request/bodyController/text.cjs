'use strict';

var utils = require('@duplojs/utils');
var base = require('./base.cjs');

const TextBodyController = base.createBodyController("text");
function controlBodyAsText(params) {
    return TextBodyController.create({
        bodyMaxSize: params?.bodyMaxSize && utils.stringToBytes(params.bodyMaxSize),
    });
}

exports.TextBodyController = TextBodyController;
exports.controlBodyAsText = controlBodyAsText;
