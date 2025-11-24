import { type BytesInString, kindHeritage } from "@duplojs/utils";
import { createInterfacesNodeLibKind } from "@interfaces-node/kind";

export class BodySizeExceedsLimitError extends kindHeritage(
	"body-size-exceeds-limit-error",
	createInterfacesNodeLibKind("body-size-exceeds-limit-error"),
	Error,
) {
	public constructor(
		public bytesInString: BytesInString | number,
	) {
		super({}, [`Body size is bigger than ${bytesInString}.`]);
	}
}
