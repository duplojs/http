import { type Floor } from "../../floor";
import { type SimplifyTopLevel, type IsEqual, type Or } from "@duplojs/utils";
import { type Process, type ProcessExportValue, type ProcessDefinition, type ProcessRequest } from "../../process";
import { type Request } from "../../request";
declare module "./builder" {
    interface ProcessBuilder<GenericDefinition extends ProcessDefinition = ProcessDefinition, GenericFloor extends Floor = {}, GenericRequest extends Request = Request> {
        exports<GenericExportation extends (keyof GenericFloor)[] = never>(exportedKey?: GenericExportation): Process<SimplifyTopLevel<GenericDefinition & (Or<[
            IsEqual<GenericExportation, never>,
            IsEqual<GenericExportation, never[]>
        ]> extends true ? {} : ProcessExportValue<SimplifyTopLevel<Pick<GenericFloor, GenericExportation[number]>>>) & (IsEqual<GenericRequest, Request> extends true ? {} : ProcessRequest<GenericRequest>)>>;
    }
}
