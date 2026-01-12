import { kindHeritage } from "@duplojs/utils";
import { createInterfacesNodeLibKind } from "@interface-node/kind";

export class BodyParseUnknownError extends kindHeritage(
	"body-parse-unknown-error",
	createInterfacesNodeLibKind("body-parse-unknown-error"),
	Error,
) {
	public constructor(
		public contentType: string,
		public unknownError: unknown,
	) {
		super({}, [`Error when parsing body with '${contentType}' content-type.`]);
	}
}
