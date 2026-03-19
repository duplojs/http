'use strict';

var utils = require('@duplojs/utils');
require('../request/index.cjs');
var empty = require('../request/bodyController/empty.cjs');

const defaultEmptyReaderImplementation = empty.EmptyBodyController.createReaderImplementation(() => Promise.resolve(utils.E.success(undefined)));

exports.defaultEmptyReaderImplementation = defaultEmptyReaderImplementation;
