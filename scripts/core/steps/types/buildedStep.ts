import { type Floor } from "@core/floor";
import { type Request } from "@core/request";
import { type Response } from "@core/response";
import { type MaybePromise } from "@duplojs/utils";

export type BuildedStep = (request: Request, floor: Floor) => MaybePromise<Floor | Response>;
