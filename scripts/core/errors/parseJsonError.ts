import { createCoreLibKind } from "@core/kind";
import { kindHeritage } from "@duplojs/utils";

export class ParseJsonError extends kindHeritage(
	"parse-json-error",
	createCoreLibKind("parse-json-error"),
	Error,
) {
	public constructor(
		public payload: string,
		public error: unknown,
	) {
		super({}, ["Error when parse on json."]);
	}
}
