'use strict';

require('../../core/metadata/index.cjs');
var base = require('../../core/metadata/base.cjs');

const IgnoreRouteCorsMetadata = base.createMetadata("ignore-by-cors");

exports.IgnoreRouteCorsMetadata = IgnoreRouteCorsMetadata;
