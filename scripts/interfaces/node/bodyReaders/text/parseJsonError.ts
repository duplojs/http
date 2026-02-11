import { kindHeritage } from "@duplojs/utils";
import { createInterfacesNodeLibKind } from "@interface-node/kind";

export class ParseJsonError extends kindHeritage(
	"parse-json-error",
	createInterfacesNodeLibKind("parse-json-error"),
	Error,
) {
	public constructor(
		public payload: string,
		public error: unknown,
	) {
		super({}, ["Error when parse on json."]);
	}
}
