import { createCoreLibKind } from "@core/kind";
import { type BytesInString, kindHeritage } from "@duplojs/utils";

export class BodySizeExceedsLimitError extends kindHeritage(
	"body-size-exceeds-limit-error",
	createCoreLibKind("body-size-exceeds-limit-error"),
	Error,
) {
	public constructor(
		public bytesInString: BytesInString | number,
	) {
		super({}, [`Body size is bigger than ${bytesInString}.`]);
	}
}
