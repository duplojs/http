import { type Floor } from "@core/floor";
import { type Request } from "@core/request";
import { type Response } from "@core/response";
import { type ProcessDefinition } from "..";

export type BuildedProcess = (request: Request, options: ProcessDefinition["options"]) => Promise<Floor | Response>;
