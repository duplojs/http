import { type Request } from "@core/request";

export type BuildedRoute = (request: Request) => Promise<void>;
