import { type Floor } from "../../floor";
import { type SimplifyTopLevel, type IsEqual, type Or } from "@duplojs/utils";
import { type Process, type ProcessExportValue, type ProcessDefinition } from "../../process";
declare module "./builder" {
    interface ProcessBuilder<GenericDefinition extends ProcessDefinition = ProcessDefinition, GenericFloor extends Floor = {}> {
        exports<GenericExportation extends (keyof GenericFloor)[] = never>(exportedKey?: GenericExportation): Process<SimplifyTopLevel<GenericDefinition & (Or<[
            IsEqual<GenericExportation, never>,
            IsEqual<GenericExportation, never[]>
        ]> extends true ? {} : ProcessExportValue<SimplifyTopLevel<Pick<GenericFloor, GenericExportation[number]>>>)>>;
    }
}
