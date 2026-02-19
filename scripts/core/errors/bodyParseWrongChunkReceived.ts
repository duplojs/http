import { createCoreLibKind } from "@core/kind";
import { kindHeritage } from "@duplojs/utils";

export class BodyParseWrongChunkReceived extends kindHeritage(
	"body-parse-wrong-chunk-received",
	createCoreLibKind("body-parse-wrong-chunk-received"),
	Error,
) {
	public constructor(
		public information: string,
		public wrongChunk: unknown,
	) {
		super({}, [`Received chunk is not ${information}`]);
	}
}
