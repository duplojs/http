import { createCoreLibKind } from "@core/kind";
import { type Request } from "@core/request";
import { E, type DP, type Kind, type BytesInString, type RemoveKind, unwrap } from "@duplojs/utils";
import { type ReceivedBodyHandler } from "./receivedBody";

const bodyExtractorKind = createCoreLibKind<"body-extractor", string>("body-extractor");

export interface BodyExtractor<
	GenericName extends string = string,
	GenericDataParser extends DP.DataParser = DP.DataParser,
> extends Kind<typeof bodyExtractorKind.definition, GenericName> {
	dataParser: GenericDataParser;

	extract(request: Request): Promise<E.Success | E.Left>;
}

export function isBodyExtractor(input: unknown): input is BodyExtractor {
	return bodyExtractorKind.has(input);
}

export interface BodyExtractorHandlerParams {
	bodyMaxSize?: number | BytesInString;
}

export type BodyExtractorHandler<
	GenericReceivedBodyHandler extends ReceivedBodyHandler,
	GenericParams extends BodyExtractorHandlerParams,
> = <
	GenericDataParser extends DP.DataParser,
>(
	dataParser: GenericDataParser,
	params: GenericParams,
) => BodyExtractor<
	GenericReceivedBodyHandler["name"],
	GenericDataParser
>;

export function createBodyExtractor<
	GenericReceivedBodyHandler extends ReceivedBodyHandler,
	GenericParams extends BodyExtractorHandlerParams,
>(
	receivedBodyHandler: GenericReceivedBodyHandler,
	getParams: (params: GenericParams) => Parameters<Parameters<GenericReceivedBodyHandler["create"]>[0]>[1],
): BodyExtractorHandler<
		GenericReceivedBodyHandler,
		GenericParams
	> {
	return (dataParser, params) => {
		const parseDataFunction = dataParser.isAsynchronous()
			? dataParser.asyncParse
			: dataParser.parse;

		const readParams = getParams(params);

		const extractor: RemoveKind<
			BodyExtractor<
				GenericReceivedBodyHandler["name"],
				typeof dataParser
			>
		> = {
			dataParser,
			async extract(request) {
				const body = request.body;

				if (!receivedBodyHandler.is(body)) {
					return E.fail();
				}

				const readResult = await body.read(
					request,
					readParams,
				);

				if (E.isLeft(readResult)) {
					return readResult;
				}

				return parseDataFunction(unwrap(readResult));
			},
		};

		return bodyExtractorKind.setTo(
			extractor,
			receivedBodyHandler.name,
		);
	};
}
