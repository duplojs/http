import { createCoreLibKind } from "@core/kind";
import { type BodyController } from "@core/request";
import { type Route } from "@core/route";
import { kindHeritage } from "@duplojs/utils";

export class NotFoundBodyReaderImplementationError extends kindHeritage(
	"not-found-body-reader-implementation-error",
	createCoreLibKind("not-found-body-reader-implementation-error"),
	Error,
) {
	public constructor(
		public route: Route,
		public bodyController: BodyController,
	) {
		super({}, ["Body reader implementation not found."]);
	}
}
