import { type BuildedProcess, type BuildedStep, buildElement, createFunctionBuilder, createProcess, createProcessStep, type HookRouteLifeCycle, processKind, stepKind, type BuildElementParams, type Process, type Steps, processStepKind } from "@core";
import { E, unwrap } from "@duplojs/utils";
import { testProcess } from "@test-utils/process";

describe("buildElement", () => {
	const createParams = (
		overrides: Partial<BuildElementParams> = {},
	): BuildElementParams => ({
		environment: "DEV",
		globalHooksRouteLifeCycle: [] as HookRouteLifeCycle[],
		processFunctionBuilders: [] as BuildElementParams["processFunctionBuilders"],
		stepFunctionBuilders: [] as BuildElementParams["stepFunctionBuilders"],
		...overrides,
	});

	const createProcessResult = () => ({
		buildedFunction: vi.fn(() => Promise.resolve()) as unknown as BuildedProcess,
		hooksRouteLifeCycle: [],
	});

	const createStepResult = () => ({
		buildedFunction: vi.fn(() => Promise.resolve()) as unknown as BuildedStep,
		hooksRouteLifeCycle: [],
	});

	const createSupportingProcessBuilder = (
		spy?: (process: Process) => void,
	) => createFunctionBuilder<Process>(
		(element, { support, notSupport }) => processKind.has(element)
			? support(element)
			: notSupport(),
		(process, { success }) => {
			spy?.(process);

			return Promise.resolve(success(createProcessResult()));
		},
	);

	const createSupportingProcessStepBuilder = (
		spy?: (step: Steps) => void,
	) => createFunctionBuilder(
		(element, { support, notSupport }) => processStepKind.has(element)
			? support(element)
			: notSupport(),
		(step, { success }) => {
			spy?.(step);

			return Promise.resolve(success(createStepResult()));
		},
	);

	const createNeverSupportProcessBuilder = () => createFunctionBuilder<Process>(
		(__, { notSupport }) => notSupport(),
		() => {
			throw new Error("builder should not execute");
		},
	);

	it("build element with fist compatible builder", async() => {
		const successSpy = vi.fn();

		const result = await buildElement(
			testProcess,
			createParams(),
			[
				createNeverSupportProcessBuilder(),
				createSupportingProcessBuilder(successSpy),
			],
		);

		expect(result).toStrictEqual({
			buildedFunction: expect.any(Function),
			hooksRouteLifeCycle: [],
		});
		expect(successSpy).toHaveBeenCalledWith(testProcess);
	});

	it("return build error when none builder is find.", async() => {
		const result = await buildElement(
			testProcess,
			createParams(),
			[createNeverSupportProcessBuilder()],
		);

		expect(E.hasInformation(result, "buildError")).toBe(true);
		expect(unwrap(result)).toBe(testProcess);
	});

	it("Return build error when builder return error", async() => {
		const followingBuilder = vi.fn();

		const failingBuilder = createFunctionBuilder<Process>(
			(element, { support, notSupport }) => processKind.has(element)
				? support(element)
				: notSupport(),
			() => E.left("buildError", testProcess),
		);

		const safeBuilder = createSupportingProcessBuilder(() => followingBuilder());

		const result = await buildElement(
			testProcess,
			createParams(),
			[
				failingBuilder,
				safeBuilder,
			],
		);

		expect(E.hasInformation(result, "buildError")).toBe(true);
		expect(followingBuilder).not.toHaveBeenCalled();
	});

	it("build nested element", async() => {
		const nestedProcess = createProcess({
			steps: [],
			options: {},
			hooks: [],
		});

		const delegatedStep = createProcessStep({
			process: nestedProcess,
		});

		const stepSpy = vi.fn();
		const nestedProcessSpy = vi.fn();

		const params = createParams({
			stepFunctionBuilders: [createSupportingProcessStepBuilder(stepSpy)],
			processFunctionBuilders: [createSupportingProcessBuilder(nestedProcessSpy)],
		});

		const mainBuilder = createFunctionBuilder<Process>(
			(element, { support, notSupport }) => processKind.has(element)
				? support(element)
				: notSupport(),
			async(process, { success, buildElement }) => {
				await buildElement(delegatedStep);
				await buildElement(nestedProcess);

				return success(createProcessResult());
			},
		);

		const result = await buildElement(
			testProcess,
			params,
			[mainBuilder],
		);

		expect(result).toStrictEqual({
			buildedFunction: expect.any(Function),
			hooksRouteLifeCycle: [],
		});
		expect(stepSpy).toHaveBeenCalledWith(delegatedStep);
		expect(nestedProcessSpy).toHaveBeenCalledWith(nestedProcess);
	});
});
