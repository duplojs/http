import { kindHeritage } from '@duplojs/utils';
import { createInterfacesNodeLibKind } from '../kind.mjs';

class BodyParseWrongChunkReceived extends kindHeritage("body-parse-wrong-chunk-received", createInterfacesNodeLibKind("body-parse-wrong-chunk-received"), Error) {
    wrongChunk;
    constructor(wrongChunk) {
        super({}, ["Received chunk is not buffer or string."]);
        this.wrongChunk = wrongChunk;
    }
}

export { BodyParseWrongChunkReceived };
