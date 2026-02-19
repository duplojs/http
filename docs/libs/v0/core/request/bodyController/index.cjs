'use strict';

var base = require('./base.cjs');
var formData = require('./formData.cjs');
var text = require('./text.cjs');



exports.createBodyController = base.createBodyController;
exports.FormDataBodyController = formData.FormDataBodyController;
exports.controlBodyAsFormData = formData.controlBodyAsFormData;
exports.TextBodyController = text.TextBodyController;
exports.controlBodyAsText = text.controlBodyAsText;
