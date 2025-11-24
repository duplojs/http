import { createKindIdentifier, type Kind } from "@duplojs/utils";
import { type stepKind } from "./kind";
import { type Steps } from "./types/steps";

export const stepIdentifier = createKindIdentifier<
	Kind<typeof stepKind.definition>,
	Steps
>();
