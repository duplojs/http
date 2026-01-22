'use strict';

require('../response/index.cjs');
var contract = require('../response/contract.cjs');

const defaultExtractContract = contract.ResponseContract.unprocessableContent("extract-error");

exports.defaultExtractContract = defaultExtractContract;
