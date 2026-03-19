import { type BodyReader } from "@core/request";
import { type BuildedRoute } from "@core/route/types";

export interface RouterElementSystem {
	readonly bodyReader: BodyReader;
	readonly buildedRoute: BuildedRoute;
}
