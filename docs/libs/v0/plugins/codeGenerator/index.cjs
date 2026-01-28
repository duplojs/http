'use strict';

require('@duplojs/data-parser-tools/toTypescript');
require('./types/index.cjs');
var plugin = require('./plugin.cjs');
var routeToDataParser = require('./routeToDataParser.cjs');
var aggregateStepContract = require('./aggregateStepContract.cjs');
var metadata = require('./metadata.cjs');



exports.codeGeneratorPlugin = plugin.codeGeneratorPlugin;
exports.routeToDataParser = routeToDataParser.routeToDataParser;
exports.aggregateStepContract = aggregateStepContract.aggregateStepContract;
exports.IgnoreByCodeGeneratorMetadata = metadata.IgnoreByCodeGeneratorMetadata;
