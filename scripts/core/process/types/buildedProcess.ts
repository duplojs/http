import { type Floor } from "@core/floor";
import { type Request } from "@core/request";
import { type Response } from "@core/response";

export type BuildedProcess = (request: Request, floor: Floor) => Promise<Floor | Response>;
