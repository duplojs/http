import { type CheckerStep } from "../checker";
import { type CutStep } from "../cut";
import { type ExtractStep } from "../extract";
import { type HandlerStep } from "../handler";
import { type PresetCheckerStep } from "../presetChecker";
import { type ProcessStep } from "../process";

export interface StepsCustom {

}

export type Steps = (
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	| StepsCustom[
		keyof StepsCustom
	]
	| CheckerStep
	| CutStep
	| ExtractStep
	| HandlerStep
	| PresetCheckerStep
	| ProcessStep
);
