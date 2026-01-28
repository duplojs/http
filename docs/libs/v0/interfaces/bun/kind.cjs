'use strict';

var utils = require('@duplojs/utils');

const createInterfacesBunLibKind = utils.createKindNamespace(
// @ts-expect-error reserved kind namespace
"DuplojsHttpInterfacesBun");

exports.createInterfacesBunLibKind = createInterfacesBunLibKind;
