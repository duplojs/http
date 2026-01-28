'use strict';

var base = require('./base.cjs');
var ignoreByRouteStore = require('./ignoreByRouteStore.cjs');



exports.createMetadata = base.createMetadata;
exports.metadataKind = base.metadataKind;
exports.IgnoreByRouteStoreMetadata = ignoreByRouteStore.IgnoreByRouteStoreMetadata;
