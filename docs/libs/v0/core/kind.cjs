'use strict';

var utils = require('@duplojs/utils');

const createCoreLibKind = utils.createKindNamespace(
// @ts-expect-error reserved kind namespace
"DuplojsHttpCore");

exports.createCoreLibKind = createCoreLibKind;
