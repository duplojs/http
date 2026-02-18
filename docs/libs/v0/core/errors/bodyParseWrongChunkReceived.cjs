'use strict';

var kind = require('../kind.cjs');
var utils = require('@duplojs/utils');

class BodyParseWrongChunkReceived extends utils.kindHeritage("body-parse-wrong-chunk-received", kind.createCoreLibKind("body-parse-wrong-chunk-received"), Error) {
    information;
    wrongChunk;
    constructor(information, wrongChunk) {
        super({}, [`Received chunk is not ${information}`]);
        this.information = information;
        this.wrongChunk = wrongChunk;
    }
}

exports.BodyParseWrongChunkReceived = BodyParseWrongChunkReceived;
