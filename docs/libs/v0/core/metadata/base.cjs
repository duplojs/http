'use strict';

var kind = require('../kind.cjs');
var utils = require('@duplojs/utils');

const metadataKind = kind.createCoreLibKind("metadata");
function createMetadata(name) {
    function metadataHandler(value) {
        return metadataKind.setTo(utils.wrapValue(value), name);
    }
    metadataHandler.dataName = name;
    metadataHandler.is = function (input) {
        return metadataKind.has(input)
            && metadataKind.getValue(input) === name;
    };
    return metadataHandler;
}

exports.createMetadata = createMetadata;
exports.metadataKind = metadataKind;
