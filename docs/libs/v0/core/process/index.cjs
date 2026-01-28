'use strict';

var utils = require('@duplojs/utils');
var kind = require('../kind.cjs');
require('./types/index.cjs');

const processKind = kind.createCoreLibKind("process");
function createProcess(definition) {
    return utils.pipe({ definition }, processKind.setTo);
}

exports.createProcess = createProcess;
exports.processKind = processKind;
