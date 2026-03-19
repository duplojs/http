import { type BodyReader } from "../../request";
import { type BuildedRoute } from "../../route/types";
export interface RouterElementSystem {
    readonly bodyReader: BodyReader;
    readonly buildedRoute: BuildedRoute;
}
