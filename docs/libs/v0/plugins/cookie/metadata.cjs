'use strict';

require('../../core/metadata/index.cjs');
var base = require('../../core/metadata/base.cjs');

const IgnoreRouteCookieMetadata = base.createMetadata("ignore-by-cookie");

exports.IgnoreRouteCookieMetadata = IgnoreRouteCookieMetadata;
