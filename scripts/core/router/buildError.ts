import { createCoreLibKind } from "@core/kind";
import { type Route } from "@core/route";
import { kindHeritage } from "@duplojs/utils";

export class RouterBuildError extends kindHeritage(
	"router-build-error",
	createCoreLibKind("router-build-error"),
	Error,
) {
	public constructor(
		public element: Route,
	) {
		super({}, ["Error during build route."]);
	}
}
