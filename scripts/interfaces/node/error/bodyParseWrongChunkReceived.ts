import { kindHeritage } from "@duplojs/utils";
import { createInterfacesNodeLibKind } from "@interfaces-node/kind";

export class BodyParseWrongChunkReceived extends kindHeritage(
	"body-parse-wrong-chunk-received",
	createInterfacesNodeLibKind("body-parse-wrong-chunk-received"),
	Error,
) {
	public constructor(
		public wrongChunk: unknown,
	) {
		super({}, ["Received chunk is not buffer or string."]);
	}
}
