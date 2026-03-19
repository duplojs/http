import { type Floor } from "../../floor";
import { type ProcessStep } from "../../steps";
import { type O, type NeverCoalescing, type FixDeepFunctionInfer, type Adaptor, type AnyFunction } from "@duplojs/utils";
import { type GetProcessExportValue, type Process } from "../../process";
import { type Metadata } from "../../metadata";
declare module "./builder" {
    interface PreflightBuilder<GenericDefinition extends PreflightBuilderDefinition = PreflightBuilderDefinition, GenericFloor extends Floor = {}> {
        exec<GenericProcess extends Process, GenericProcessExportValue extends GetProcessExportValue<GenericProcess>, const GenericImportation extends readonly Extract<keyof GenericProcessExportValue, string>[] = never, GenericOptions extends (GenericProcess["definition"]["options"] | ((floor: GenericFloor) => Exclude<GenericProcess["definition"]["options"], undefined>)) = never, const GenericMetadata extends readonly Metadata[] = readonly []>(process: GenericProcess, params?: {
            readonly imports?: GenericImportation;
            readonly options?: FixDeepFunctionInfer<GenericProcess["definition"]["options"] | ((floor: GenericFloor) => GenericProcess["definition"]["options"]), GenericOptions>;
        }, ...metadata: GenericMetadata): PreflightBuilder<O.AssignObjects<GenericDefinition, {
            readonly preflightSteps: readonly [
                ...GenericDefinition["preflightSteps"],
                ProcessStep<{
                    readonly process: GenericProcess;
                    readonly options: NeverCoalescing<Adaptor<GenericOptions, AnyFunction | GenericProcess["definition"]["options"]>, undefined>;
                    readonly imports: NeverCoalescing<GenericImportation, undefined>;
                    readonly metadata: GenericMetadata;
                }>
            ];
        }>, O.AssignObjects<GenericFloor, Pick<GenericProcessExportValue, GenericImportation[number]>>>;
    }
}
