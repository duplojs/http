import { ResponseContract, useCheckerBuilder, createPresetChecker, type PresetChecker, presetCheckerKind } from "@core";
import { forward, type ExpectType } from "@duplojs/utils";

describe("presetChecker", () => {
	it("create preset checker", () => {
		const checker = useCheckerBuilder()
			.handler(
				(input: string, { output }) => input
					? output("test", true)
					: output("toto", false),
			);

		const presetChecker = createPresetChecker(
			checker,
			{
				result: "test",
				otherwise: ResponseContract.notFound("notfound"),
			},
		);

		expect(presetChecker).toStrictEqual({
			[presetCheckerKind.runTimeKey]: null,
			definition: {
				checker,
				result: "test",
				responseContract: ResponseContract.notFound("notfound"),
			},
			indexing: expect.any(Function),
			options: expect.any(Function),
			rewriteInput: expect.any(Function),
		});

		type Check = ExpectType<
			typeof presetChecker,
			PresetChecker<{
				readonly result: "test";
				readonly checker: typeof checker;
				readonly responseContract: ReturnType<typeof ResponseContract.notFound<"notfound">>;
			}>,
			"strict"
		>;
	});

	it("create preset checker with options", () => {
		const checker = useCheckerBuilder({
			options: forward<{ test: string | null }>({ test: null }),
		})
			.handler(
				(input: string, { output }) => input
					? output("test", true)
					: output("toto", false),
			);

		const presetChecker = createPresetChecker(
			checker,
			{
				result: ["test"],
				otherwise: ResponseContract.notFound("notfound"),
				options: { test: "test" },
			},
		);

		expect(presetChecker).toStrictEqual({
			[presetCheckerKind.runTimeKey]: null,
			definition: {
				checker,
				result: ["test"],
				responseContract: ResponseContract.notFound("notfound"),
				options: { test: "test" },
			},
			indexing: expect.any(Function),
			options: expect.any(Function),
			rewriteInput: expect.any(Function),
		});

		type Check = ExpectType<
			typeof presetChecker,
			PresetChecker<{
				readonly options: {
					readonly test: "test";
				};
				readonly result: readonly ["test"];
				readonly checker: typeof checker;
				readonly responseContract: ReturnType<typeof ResponseContract.notFound<"notfound">>;
			}>,
			"strict"
		>;

		const newPresetChecker = presetChecker.options({
			test: null,
		});

		expect(newPresetChecker).toStrictEqual({
			[presetCheckerKind.runTimeKey]: null,
			definition: {
				checker,
				result: ["test"],
				responseContract: ResponseContract.notFound("notfound"),
				options: { test: null },
			},
			indexing: expect.any(Function),
			options: expect.any(Function),
			rewriteInput: expect.any(Function),
		});

		type Check1 = ExpectType<
			typeof newPresetChecker,
			PresetChecker<{
				readonly options: {
					readonly test: null;
				};
				readonly result: readonly ["test"];
				readonly checker: typeof checker;
				readonly responseContract: ReturnType<typeof ResponseContract.notFound<"notfound">>;
			}>,
			"strict"
		>;
	});

	it("create preset checker with indexing", () => {
		const checker = useCheckerBuilder()
			.handler(
				(input: string, { output }) => input
					? output("test", true)
					: output("toto", false),
			);

		const presetChecker = createPresetChecker(
			checker,
			{
				result: ["test", "toto"],
				otherwise: ResponseContract.notFound("notfound"),
				indexing: "key1",
			},
		);

		expect(presetChecker).toStrictEqual({
			[presetCheckerKind.runTimeKey]: null,
			definition: {
				checker,
				result: ["test", "toto"],
				responseContract: ResponseContract.notFound("notfound"),
				indexing: "key1",
			},
			indexing: expect.any(Function),
			options: expect.any(Function),
			rewriteInput: expect.any(Function),
		});

		type Check = ExpectType<
			typeof presetChecker,
			PresetChecker<{
				readonly indexing: "key1";
				readonly result: readonly ["test", "toto"];
				readonly checker: typeof checker;
				readonly responseContract: ReturnType<typeof ResponseContract.notFound<"notfound">>;
			}>,
			"strict"
		>;

		const newPresetChecker = presetChecker.indexing("key2");

		expect(newPresetChecker).toStrictEqual({
			[presetCheckerKind.runTimeKey]: null,
			definition: {
				checker,
				result: ["test", "toto"],
				responseContract: ResponseContract.notFound("notfound"),
				indexing: "key2",
			},
			indexing: expect.any(Function),
			options: expect.any(Function),
			rewriteInput: expect.any(Function),
		});

		type Check1 = ExpectType<
			typeof newPresetChecker,
			PresetChecker<{
				readonly indexing: "key2";
				readonly result: readonly ["test", "toto"];
				readonly checker: typeof checker;
				readonly responseContract: ReturnType<typeof ResponseContract.notFound<"notfound">>;
			}>,
			"strict"
		>;
	});

	it("create preset checker with indexing", () => {
		const checker = useCheckerBuilder()
			.handler(
				(input: string, { output }) => input
					? output("test", true)
					: output("toto", false),
			);

		const rewriteInput = (input: number) => String(input);

		const presetChecker = createPresetChecker(
			checker,
			{
				result: "test",
				otherwise: ResponseContract.notFound("notfound"),
				rewriteInput,
			},
		);

		expect(presetChecker).toStrictEqual({
			[presetCheckerKind.runTimeKey]: null,
			definition: {
				checker,
				result: "test",
				responseContract: ResponseContract.notFound("notfound"),
				rewriteInput,
			},
			indexing: expect.any(Function),
			options: expect.any(Function),
			rewriteInput: expect.any(Function),
		});

		type Check = ExpectType<
			typeof presetChecker,
			PresetChecker<{
				// eslint-disable-next-line @typescript-eslint/method-signature-style
				readonly rewriteInput: (input: number) => string;
				readonly result: "test";
				readonly checker: typeof checker;
				readonly responseContract: ReturnType<typeof ResponseContract.notFound<"notfound">>;
			}>,
			"strict"
		>;

		const newRewriteInput = (input: bigint) => String(input);

		const newPresetChecker = presetChecker.rewriteInput(
			newRewriteInput,
		);

		expect(newPresetChecker).toStrictEqual({
			[presetCheckerKind.runTimeKey]: null,
			definition: {
				checker,
				result: "test",
				responseContract: ResponseContract.notFound("notfound"),
				rewriteInput: newRewriteInput,
			},
			indexing: expect.any(Function),
			options: expect.any(Function),
			rewriteInput: expect.any(Function),
		});

		type Check1 = ExpectType<
			typeof newPresetChecker,
			PresetChecker<{
				rewriteInput(input: bigint): string;
				readonly result: "test";
				readonly checker: typeof checker;
				readonly responseContract: ReturnType<typeof ResponseContract.notFound<"notfound">>;
			}>,
			"strict"
		>;
	});
});
