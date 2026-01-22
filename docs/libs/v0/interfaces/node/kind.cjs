'use strict';

var utils = require('@duplojs/utils');

const createInterfacesNodeLibKind = utils.createKindNamespace(
// @ts-expect-error reserved kind namespace
"DuplojsHttpInterfacesNode");

exports.createInterfacesNodeLibKind = createInterfacesNodeLibKind;
