import { createCoreLibKind } from "@core/kind";
import { type Route } from "@core/route";
import { type Steps } from "@core/steps";
import { kindHeritage } from "@duplojs/utils";

export class RouterBuildError extends kindHeritage(
	"router-build-error",
	createCoreLibKind("router-build-error"),
	Error,
) {
	public constructor(
		public route: Route,
		public element: Route | Steps,
	) {
		super({}, ["Error during build route."]);
	}
}
