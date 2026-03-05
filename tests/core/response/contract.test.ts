import { ResponseContract } from "@core";
import { DP, type ExpectType } from "@duplojs/utils";

describe("ResponseContract", () => {
	it("creates contract for 201 Created", () => {
		const contract = ResponseContract.created("resource created", DP.string());

		expect(contract).toStrictEqual({
			code: "201",
			information: "resource created",
			body: expect.objectContaining({
				[DP.stringKind.runTimeKey]: null,
			}),
			[ResponseContract.contractKind.runTimeKey]: null,
		});

		type Check1 = ExpectType<
			typeof contract,
			ResponseContract.Contract<
				"201",
				"resource created",
				DP.DataParserString<{
					readonly errorMessage?: string | undefined;
					readonly coerce: boolean;
					readonly checkers: readonly [];
				}>
			>,
			"strict"
		>;

		const contractWithEmptySchema = ResponseContract.created("resource created");

		expect(contractWithEmptySchema).toStrictEqual({
			code: "201",
			information: "resource created",
			body: expect.objectContaining({
				[DP.emptyKind.runTimeKey]: null,
			}),
			[ResponseContract.contractKind.runTimeKey]: null,
		});

		type Check2 = ExpectType<
			typeof contractWithEmptySchema,
			ResponseContract.Contract<
				"201",
				"resource created",
				DP.DataParserEmpty<{
					readonly errorMessage?: string | undefined;
					readonly coerce: boolean;
					readonly checkers: readonly [];
				}>
			>,
			"strict"
		>;
	});

	it("create contract with no body", () => {
		const contract = ResponseContract.noContent("my super information");

		expect(contract).toStrictEqual({
			code: "204",
			information: "my super information",
			body: expect.objectContaining({
				[DP.emptyKind.runTimeKey]: null,
			}),
			[ResponseContract.contractKind.runTimeKey]: null,
		});

		type Check = ExpectType<
			typeof contract,
			ResponseContract.Contract<
				"204",
				"my super information",
				DP.DataParserEmpty<DP.DataParserDefinitionEmpty>
			>,
			"strict"
		>;
	});

	it("create contract for 200 ok", () => {
		const contract = ResponseContract.ok("my super information", DP.string());

		expect(contract).toStrictEqual({
			code: "200",
			information: "my super information",
			body: expect.objectContaining({
				[DP.stringKind.runTimeKey]: null,
			}),
			[ResponseContract.contractKind.runTimeKey]: null,
		});

		type Check = ExpectType<
			typeof contract,
			ResponseContract.Contract<
				"200",
				"my super information",
				DP.DataParserString<{
					readonly errorMessage?: string | undefined;
					readonly coerce: boolean;
					readonly checkers: readonly [];
				}>
			>,
			"strict"
		>;
	});

	it("error", () => {
		const error = new ResponseContract.Error("test", "");

		expect(error).instanceof(Error);
	});
});
