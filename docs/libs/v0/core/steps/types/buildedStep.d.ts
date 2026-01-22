import { type Floor } from "../../floor";
import { type Request } from "../../request";
import { type Response } from "../../response";
import { type MaybePromise } from "@duplojs/utils";
export type BuildedStep = (request: Request, floor: Floor) => MaybePromise<Floor | Response>;
