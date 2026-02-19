import { createCoreLibKind } from "@core/kind";
import { kindHeritage } from "@duplojs/utils";

export class WrongContentTypeError extends kindHeritage(
	"wrong-content-type-error",
	createCoreLibKind("wrong-content-type-error"),
	Error,
) {
	public constructor(
		public expectedContentType: string,
		public contentType: string,
	) {
		super({}, [`expect content-type "${expectedContentType}" but receive "${contentType}".`]);
	}
}
