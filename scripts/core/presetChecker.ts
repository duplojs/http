import { type O, pipe, type Kind, type RemoveKind, type MaybeArray } from "@duplojs/utils";
import { createCoreLibKind } from "./kind";
import { type GetCheckerInput, type Checker, type GetCheckerOptions, type GetCheckerResult } from "./checker";
import { type ClientErrorResponseCode, type ResponseContract } from "./response";

export interface PresetCheckerDefinition {
	readonly checker: Checker;
	readonly result: string | readonly string[];
	readonly indexing?: string;
	rewriteInput?(input: unknown): unknown;
	readonly options?: Record<string, unknown>;
	readonly responseContract: ResponseContract.Contract<ClientErrorResponseCode>;
}

export const presetCheckerKind = createCoreLibKind("preset-checker");

export interface PresetChecker<
	GenericDefinition extends PresetCheckerDefinition = PresetCheckerDefinition,
> extends Kind<typeof presetCheckerKind.definition> {
	readonly definition: GenericDefinition;
	indexing<
		GenericIndex extends string,
	>(
		indexing: GenericIndex
	): PresetChecker<
		O.AssignObjects<
			GenericDefinition,
			{ readonly indexing: GenericIndex }
		>
	>;
	rewriteInput<
		GenericInput extends unknown,
	>(
		rewriteInput: (input: GenericInput) => GetCheckerInput<GenericDefinition["checker"]>
	): PresetChecker<
		O.AssignObjects<
			GenericDefinition,
			{ rewriteInput(input: GenericInput): GetCheckerInput<GenericDefinition["checker"]> }
		>
	>;
	options<
		const GenericOptions extends GetCheckerOptions<GenericDefinition["checker"]>,
	>(
		options: GenericOptions
	): PresetChecker<
		O.AssignObjects<
			GenericDefinition,
			{ readonly options: GenericOptions }
		>
	>;
}

export function createPresetChecker<
	GenericChecker extends Checker,
	const GenericDefinition extends {
		result: MaybeArray<Awaited<GetCheckerResult<GenericChecker>>["information"]>;
		indexing?: string;
		rewriteInput?(input: unknown): GetCheckerInput<GenericChecker>;
		options?: GetCheckerOptions<GenericChecker>;
		otherwise: ResponseContract.Contract<ClientErrorResponseCode>;
	},
>(
	checker: GenericChecker,
	{ otherwise, ...definition }: GenericDefinition,
): PresetChecker<
		O.AssignObjects<
			Omit<GenericDefinition, "otherwise">,
			{
				readonly checker: GenericChecker;
				readonly responseContract: GenericDefinition["otherwise"];
			}
		>
	> {
	return pipe(
		{
			definition: {
				...definition,
				checker,
				responseContract: otherwise,

			},
			indexing(indexing) {
				return createPresetChecker(
					checker,
					{
						...definition,
						indexing,
						otherwise,
					},
				);
			},
			rewriteInput(rewriteInput) {
				return createPresetChecker(
					checker,
					{
						...definition,
						rewriteInput,
						otherwise,
					},
				);
			},
			options(options) {
				return createPresetChecker(
					checker,
					{
						...definition,
						options,
						otherwise,
					},
				);
			},
		} satisfies RemoveKind<PresetChecker>,
		presetCheckerKind.setTo,
	) as never;
}
