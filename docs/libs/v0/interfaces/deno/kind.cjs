'use strict';

var utils = require('@duplojs/utils');

const createInterfacesDenoLibKind = utils.createKindNamespace(
// @ts-expect-error reserved kind namespace
"DuplojsHttpInterfacesDeno");

exports.createInterfacesDenoLibKind = createInterfacesDenoLibKind;
