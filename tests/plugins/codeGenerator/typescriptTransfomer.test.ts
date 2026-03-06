import { defaultTransformers, render } from "@duplojs/data-parser-tools/toTypescript";
import { SDPE } from "@duplojs/server-utils";
import { DPE } from "@duplojs/utils";
import { dateTransformer, fileTransformer, timeTransformer } from "@plugin-codeGenerator/typescriptTransformer";

describe("typescript transformer", () => {
	it("file", () => {
		expect(
			render(
				DPE.array(SDPE.file()),
				{
					identifier: "ArrayString",
					transformers: [fileTransformer, ...defaultTransformers],
					mode: "in",
				},
			),
		).toMatchSnapshot();
	});

	it("date", () => {
		expect(
			render(
				DPE.array(DPE.date()),
				{
					identifier: "ArrayString",
					transformers: [dateTransformer, ...defaultTransformers],
					mode: "in",
				},
			),
		).toMatchSnapshot();
	});

	it("time", () => {
		expect(
			render(
				DPE.array(DPE.time()),
				{
					identifier: "ArrayString",
					transformers: [timeTransformer, ...defaultTransformers],
					mode: "in",
				},
			),
		).toMatchSnapshot();
	});
});
