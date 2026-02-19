'use strict';

require('../request/index.cjs');
var text = require('../request/bodyController/text.cjs');

const defaultBodyController = text.controlBodyAsText();

exports.defaultBodyController = defaultBodyController;
