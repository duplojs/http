'use strict';

var utils = require('@duplojs/utils');

const createCookiePluginKind = utils.createKindNamespace(
// @ts-expect-error reserved kind namespace
"DuplojsCookiePlugin");

exports.createCookiePluginKind = createCookiePluginKind;
