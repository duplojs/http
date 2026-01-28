import { type Floor } from "../../floor";
import { type RouteDefinition } from "../../route";
import { type PresetCheckerStep } from "../../steps";
import { type O, type A } from "@duplojs/utils";
import { type Request } from "../../request";
import { type GetPresetCheckerIndex, type GetPresetCheckerInformation, type GetPresetCheckerResult, type GetPresetCheckerInput, type PresetChecker } from "../../presetChecker";
import { type Metadata } from "../../metadata";
declare module "./builder" {
    interface RouteBuilder<GenericDefinition extends RouteDefinition = RouteDefinition, GenericFloor extends Floor = {}, GenericRequest extends Request = Request> {
        presetCheck<GenericPresetChecker extends PresetChecker, GenericInput extends GetPresetCheckerInput<GenericPresetChecker>, const GenericMetadata extends readonly Metadata[] = readonly []>(presetChecker: GenericPresetChecker, input: (floor: GenericFloor) => GenericInput, ...metadata: GenericMetadata): RouteBuilder<O.AssignObjects<GenericDefinition, {
            readonly steps: readonly [
                ...GenericDefinition["steps"],
                PresetCheckerStep<{
                    readonly presetChecker: GenericPresetChecker;
                    input(floor: GenericFloor): GenericInput;
                    readonly metadata: GenericMetadata;
                }>
            ];
        }>, O.AssignObjects<GenericFloor, {
            [Prop in GetPresetCheckerIndex<GenericPresetChecker>]: Extract<Awaited<GetPresetCheckerResult<GenericPresetChecker>>, {
                information: A.ArrayCoalescing<GetPresetCheckerInformation<GenericPresetChecker>>[number];
            }>["value"];
        }>, GenericRequest>;
    }
}
