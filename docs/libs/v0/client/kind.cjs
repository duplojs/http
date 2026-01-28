'use strict';

var utils = require('@duplojs/utils');

const createClientKind = utils.createKindNamespace(
// @ts-expect-error reserved kind namespace
"DuplojsHttpClient");

exports.createClientKind = createClientKind;
