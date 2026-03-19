import { type BodyReader } from "@core/request";
import { type BuildedRoute } from "@core/route/types";

export interface RouterElement {
	readonly pattern: RegExp;
	readonly matchedPath: string;
	readonly bodyReader: BodyReader;
	readonly buildedRoute: BuildedRoute;
}
