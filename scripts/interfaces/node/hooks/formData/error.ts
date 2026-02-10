import { kindHeritage } from "@duplojs/utils";
import { createInterfacesNodeLibKind } from "@interface-node/kind";

export class BodyParseFormDataError extends kindHeritage(
	"body-parse-form-data-error",
	createInterfacesNodeLibKind("body-parse-form-data-error"),
	Error,
) {
	public constructor(
		public information: string,
	) {
		super({}, [`Body parse form date error: ${information}`]);
	}
}
