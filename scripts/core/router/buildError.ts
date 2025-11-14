import { type ElementsToBeBuilt } from "@core/functionBuilder";
import { createCoreLibKind } from "@core/kind";
import { kindHeritage } from "@duplojs/utils";

export class RouterBuildError extends kindHeritage(
	"router-build-error",
	createCoreLibKind("router-build-error"),
	Error,
) {
	public constructor(
		public element: ElementsToBeBuilt,
	) {
		super({}, ["Error during build route."]);
	}
}
