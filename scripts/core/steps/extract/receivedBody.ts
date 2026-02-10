import { createCoreLibKind } from "@core/kind";
import { type Request } from "@core/request";
import { type RemoveKind, type E, type Kind, type MemoizedPromise, memoPromise } from "@duplojs/utils";

export interface ReadReceivedBodyParams {
	bodyMaxSize?: number;
}

const receivedBodyKind = createCoreLibKind<"received-body", string>("received-body");

export interface ReceivedBody<
	GenericName extends string = string,
	GenericParams extends ReadReceivedBodyParams = ReadReceivedBodyParams,
> extends Kind<typeof receivedBodyKind.definition, GenericName> {
	read(
		request: Request,
		params: GenericParams
	): Promise<E.Success | E.Error<Error>>;
}

const receivedBodyHandlerKind = createCoreLibKind("received-body-handler");

export interface ReceivedBodyHandler<
	GenericName extends string = string,
	GenericParams extends ReadReceivedBodyParams = ReadReceivedBodyParams,
> extends Kind<typeof receivedBodyHandlerKind.definition> {
	readonly name: GenericName;
	create(
		read: ReceivedBody<
			GenericName,
			GenericParams
		>["read"]
	): ReceivedBody<GenericName, GenericParams>;
	is(input: unknown): input is ReceivedBody<GenericName, GenericParams>;
}

export function createBodyReception<
	GenericName extends string,
	GenericParams extends ReadReceivedBodyParams = ReadReceivedBodyParams,
>(name: GenericName): ReceivedBodyHandler<GenericName, GenericParams> {
	type CurrentReceivedBody = ReceivedBody<GenericName, GenericParams>;

	return receivedBodyHandlerKind.setTo(
		{
			name,
			create(
				read: CurrentReceivedBody["read"],
			) {
				let memoResult = undefined as undefined | MemoizedPromise<E.Success | E.Error<Error>>;

				return receivedBodyKind.setTo(
					{
						async read(request, params) {
							if (memoResult) {
								return memoResult.value;
							}

							memoResult = memoPromise(() => read(request, params));

							return memoResult.value;
						},
					} satisfies RemoveKind<CurrentReceivedBody>,
					name,
				);
			},
			is(input) {
				return receivedBodyKind.has(input) && receivedBodyKind.getValue(input) === name;
			},
		} satisfies RemoveKind<ReceivedBodyHandler>,
	);
}

