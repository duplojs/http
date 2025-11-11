import { type BuildedRoute } from "@core/route";

export type BuildedRouter = (method: string, path: string) => BuildedRoute;
