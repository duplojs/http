import { type Floor } from "@core/floor";
import { createExtractStep, type ExtractShape, type ExtractStep } from "@core/steps";
import { type DP, type ObjectEntry, type O, type SimplifyTopLevel, type NeverCoalescing } from "@duplojs/utils";
import { processBuilder } from "./builder";
import { type ClientErrorResponseCode, type ResponseContract } from "@core/response";
import { type ProcessDefinition } from "@core/process";
import { type Request } from "@core/request";
import { type Metadata } from "@core/metadata";

declare module "./builder" {
	interface ProcessBuilder<
		GenericDefinition extends ProcessDefinition = ProcessDefinition,
		GenericFloor extends Floor = {},
		GenericRequest extends Request = Request,
	> {
		extract<
			GenericShape extends ExtractShape,
			GenericResponseContract extends (
				| ResponseContract.Contract<ClientErrorResponseCode, string, DP.DataParserEmpty>
				| undefined
			) = never,
			const GenericMetadata extends readonly Metadata[] = readonly [],
		>(
			shape: GenericShape,
			responseContract?: GenericResponseContract,
			...metadata: GenericMetadata
		): ProcessBuilder<
			O.AssignObjects<
				GenericDefinition,
				{
					readonly steps: readonly [
						...GenericDefinition["steps"],
						ExtractStep<
							{
								readonly shape: GenericShape;
								readonly responseContract: NeverCoalescing<GenericResponseContract, undefined>;
								readonly metadata: GenericMetadata;
							}
						>,
					];
				}
			>,
			O.AssignObjects<
				GenericFloor,
				{
					[Prop in keyof GenericShape]: GenericShape[Prop] extends DP.DataParser
						? [Prop, DP.Output<GenericShape[Prop]>]
						: GenericShape[Prop] extends infer InferredSubShape extends Record<string, DP.DataParser>
							? {
								[Prop in keyof InferredSubShape]: [Prop, DP.Output<InferredSubShape[Prop]>]
							}[keyof InferredSubShape]
							: never
				}[keyof GenericShape] extends infer InferredEntry extends ObjectEntry
					? SimplifyTopLevel<{
						[Entry in InferredEntry as Entry[0]]: Entry[1]
					}>
					: never
			>,
			GenericRequest
		>;
	}
}

processBuilder.set(
	"extract",
	({
		args: [
			shape,
			responseContract,
			...metadata
		],
		accumulator,
		next,
	}) => next({
		...accumulator,
		steps: [
			...accumulator.steps,
			createExtractStep({
				shape,
				responseContract,
				metadata,
			}),
		],
	}),
);
