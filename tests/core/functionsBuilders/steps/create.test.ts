import { createCutStep, createExtractStep, createStepFunctionBuilder, defaultExtractContract, type ExtractStep, extractStepKind } from "@core";
import { E, type ExpectType } from "@duplojs/utils";

describe("createStepFunctionBuilder", () => {
	const fakeFnc = vi.fn();
	const functionBuilder = createStepFunctionBuilder(
		extractStepKind.has,
		(step, { success }) => {
			type Check = ExpectType<
				typeof step,
				ExtractStep,
				"strict"
			>;
			fakeFnc(step);

			return success({
				buildedFunction: () => ({}),
				hooksRouteLifeCycle: [],
			});
		},
	);

	beforeEach(() => {
		fakeFnc.mockClear();
	});

	it("support element", async() => {
		const result = await functionBuilder(
			createExtractStep({ shape: {} }),
			{
				success: (element) => E.right("buildSuccess", element),
				buildStep: () => void undefined as never,
				environment: "DEV",
				defaultExtractContract,
			},
		);

		expect(E.isRight(result)).toBe(true);
		expect(fakeFnc).toHaveBeenCalledOnce();
	});

	it("not support element", async() => {
		const result = await functionBuilder(
			createCutStep({
				theFunction: () => ({}) as never,
				responseContract: [],
			}),
			{
				success: (element) => E.right("buildSuccess", element),
				buildStep: () => void undefined as never,
				environment: "DEV",
				defaultExtractContract,
			},
		);

		expect(E.hasInformation(result, "stepNotSupport")).toBe(true);
		expect(fakeFnc).not.toBeCalled();
	});
});
