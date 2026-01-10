import { type Route } from "@core/route";
import { stepsToDataParser } from "./stepsToDataParser";
import { A, DP, type DString, type ExpectType, innerPipe, O, pipe } from "@duplojs/utils";
import { type ResponseCode, type ResponseContract } from "@core/response";

export interface RouteToDataParserParams {
	readonly defaultExtractContract: ResponseContract.Contract;
}

export const digitDataParser = DP.literal<DString.Digit>(
	["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
).setIdentifier("Digit");

export const responseCodeDataParsers = {
	information: DP.templateLiteral([
		"1",
		digitDataParser,
		digitDataParser,
	]),
	success: DP.templateLiteral([
		"2",
		digitDataParser,
		digitDataParser,
	]),
	redirection: DP.templateLiteral([
		"3",
		digitDataParser,
		digitDataParser,
	]),
	clientError: DP.templateLiteral([
		"4",
		digitDataParser,
		digitDataParser,
	]),
	serverError: DP.templateLiteral([
		"5",
		digitDataParser,
		digitDataParser,
	]),
};

export const responseCodeDataParser = DP.union([
	responseCodeDataParsers.information,
	responseCodeDataParsers.success,
	responseCodeDataParsers.redirection,
	responseCodeDataParsers.clientError,
	responseCodeDataParsers.serverError,
]).setIdentifier("ResponseCode");

type _CheckHttpCode = ExpectType<
	DP.Output<typeof responseCodeDataParser>,
	ResponseCode,
	"strict"
>;

export function routeToDataParser(
	route: Route,
	params: RouteToDataParserParams,
): DP.DataParser {
	return pipe(
		[
			...route.definition.preflightSteps,
			...route.definition.steps,
		],
		(steps) => stepsToDataParser(steps, {
			defaultExtractContract: params.defaultExtractContract,
		}),
		O.transformProperty(
			"entrypointContract",
			innerPipe(
				O.entries,
				A.select(
					({ element: [key, value], select, skip }) => {
						if (DP.dataParserKind.has(value)) {
							return select(O.entry(key, value));
						}

						if (O.countKeys(value) > 0) {
							return select(
								O.entry(key, DP.object(value)),
							);
						}

						return skip();
					},
				),
				O.fromEntries,
			),
		),
		({ endpointContract, entrypointContract }) => DP.object({
			method: DP.literal(route.definition.method),
			path: DP.literal(route.definition.paths),
			...entrypointContract,
			responses: DP.union([
				DP.object({
					code: responseCodeDataParser,
					information: DP.templateLiteral(["from-hook-", DP.string()]),
					body: DP.unknown(),
					fromHook: DP.literal(true),
				}),
				DP.object({
					code: responseCodeDataParsers.serverError,
					information: DP.string(),
					body: DP.unknown(),
				}),
				...endpointContract,
			]),
		}),
	);
}
