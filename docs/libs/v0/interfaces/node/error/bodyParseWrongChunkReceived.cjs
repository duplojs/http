'use strict';

var utils = require('@duplojs/utils');
var kind = require('../kind.cjs');

class BodyParseWrongChunkReceived extends utils.kindHeritage("body-parse-wrong-chunk-received", kind.createInterfacesNodeLibKind("body-parse-wrong-chunk-received"), Error) {
    wrongChunk;
    constructor(wrongChunk) {
        super({}, ["Received chunk is not buffer or string."]);
        this.wrongChunk = wrongChunk;
    }
}

exports.BodyParseWrongChunkReceived = BodyParseWrongChunkReceived;
