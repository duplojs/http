'use strict';

var utils = require('@duplojs/utils');
var kind = require('./kind.cjs');

const checkerOutputKind = kind.createCoreLibKind("checker-output");
const checkerKind = kind.createCoreLibKind("checker");
function createChecker(definition) {
    return utils.pipe({ definition }, checkerKind.setTo);
}

exports.checkerKind = checkerKind;
exports.checkerOutputKind = checkerOutputKind;
exports.createChecker = createChecker;
