import { type Kind, type O } from "@duplojs/utils";
import { type CheckerStep } from "../checker";
import { type CutStep } from "../cut";
import { type ExtractStep } from "../extract";
import { type HandlerStep } from "../handler";
import { type PresetCheckerStep } from "../presetChecker";
import { type ProcessStep } from "../process";
import { type stepKind } from "../kind";
export interface StepsCustom {
}
export type Steps = (StepsCustom[O.GetPropsWithValueExtends<StepsCustom, Kind<typeof stepKind.definition>>] | CheckerStep | CutStep | ExtractStep | HandlerStep | PresetCheckerStep | ProcessStep);
