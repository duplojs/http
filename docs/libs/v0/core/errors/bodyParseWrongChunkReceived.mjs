import { createCoreLibKind } from '../kind.mjs';
import { kindHeritage } from '@duplojs/utils';

class BodyParseWrongChunkReceived extends kindHeritage("body-parse-wrong-chunk-received", createCoreLibKind("body-parse-wrong-chunk-received"), Error) {
    information;
    wrongChunk;
    constructor(information, wrongChunk) {
        super({}, [`Received chunk is not ${information}`]);
        this.information = information;
        this.wrongChunk = wrongChunk;
    }
}

export { BodyParseWrongChunkReceived };
