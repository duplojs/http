import { defaultTransformers, render } from "@duplojs/data-parser-tools/toTypescript";
import { SDPE } from "@duplojs/server-utils";
import { DPE } from "@duplojs/utils";
import { fileTransformer } from "@plugin-codeGenerator/typescriptTransfomer";

describe("typescript transformer", () => {
	it("file", () => {
		expect(
			render(
				DPE.array(SDPE.file()),
				{
					identifier: "ArrayString",
					transformers: [fileTransformer, ...defaultTransformers],
					mode: "out",
				},
			),
		).toMatchSnapshot();
	});
});
