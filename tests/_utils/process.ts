import { createProcess } from "@core";
import { forward } from "@duplojs/utils";

export const testProcess = createProcess({
	steps: [],
	options: forward<{ test?: boolean }>({ test: true }),
	hooks: [],
});
