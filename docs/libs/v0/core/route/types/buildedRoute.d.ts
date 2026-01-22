import { type Request } from "../../request";
export type BuildedRoute = (request: Request) => Promise<void>;
