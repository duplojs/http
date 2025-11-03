import { createCoreLibKind } from "@core/kind";
import { type Kind } from "@duplojs/utils";

export const stepKind = createCoreLibKind("step");

export type StepKind = Kind<typeof stepKind.definition>;
