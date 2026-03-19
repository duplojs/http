'use strict';

var utils = require('@duplojs/utils');

const createStaticPluginKind = utils.createKindNamespace(
// @ts-expect-error reserved kind namespace
"DuplojsStaticPlugin");

exports.createStaticPluginKind = createStaticPluginKind;
