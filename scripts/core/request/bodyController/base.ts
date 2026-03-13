import { createCoreLibKind } from "@core/kind";
import { type Request } from "@core/request";
import { E, type RemoveKind, type Kind, unwrap, kindHeritage } from "@duplojs/utils";

export interface BodyControllerParams {
	bodyMaxSize?: number;
}

const bodyReaderKind = createCoreLibKind<"body-reader", string>("body-reader");

export interface BodyReader<
	GenericName extends string = string,
> extends Kind<typeof bodyReaderKind.definition, GenericName> {
	read(
		request: Request,
	): Promise<E.Success | E.Error<Error>>;
}

const bodyReaderImplementationKind = createCoreLibKind<"body-reader-implementation", string>("body-reader-implementation");

export interface BodyReaderImplementation<
	GenericName extends string = string,
	GenericParams extends BodyControllerParams = BodyControllerParams,
> extends Kind<typeof bodyReaderImplementationKind.definition, GenericName> {
	read(
		request: Request,
		params: GenericParams
	): Promise<E.Success | E.Error<Error>>;
}

const bodyControllerKind = createCoreLibKind<"body-controller", string>("body-controller");

export interface BodyController<
	GenericName extends string = string,
	GenericParams extends BodyControllerParams = BodyControllerParams,
> extends Kind<
		typeof bodyControllerKind.definition,
		GenericName
	> {
	readonly name: GenericName;
	readonly params: GenericParams;
	tryToCreateReader(
		readerImplementation: BodyReaderImplementation
	): E.Success<BodyReader<GenericName>> | E.Fail;
	createReaderOrThrow(
		readerImplementation: BodyReaderImplementation
	): BodyReader<GenericName>;
}

const bodyControllerHandlerKind = createCoreLibKind("body-controller-handler");

export interface BodyControllerHandler<
	GenericName extends string = string,
	GenericParams extends BodyControllerParams = BodyControllerParams,
> extends Kind<typeof bodyControllerHandlerKind.definition> {
	readonly name: GenericName;
	create(params: GenericParams): BodyController<GenericName, GenericParams>;
	createReaderImplementation(
		read: BodyReaderImplementation<GenericName, GenericParams>["read"]
	): BodyReaderImplementation<GenericName, GenericParams>;
	is(input: unknown): input is BodyController<GenericName, GenericParams>;
}

export class WrongBodyReaderImplementationError extends kindHeritage(
	"wrong-body-reader-implementation",
	createCoreLibKind("wrong-body-reader-implementation"),
	Error,
) {
	public constructor(
		public controllerName: string,
		public bodyReaderImplementation: BodyReaderImplementation,
	) {
		super({}, ["Received wrong body reader implementation."]);
	}
}

export function createBodyController<
	GenericName extends string,
	GenericParams extends BodyControllerParams,
>(name: GenericName): BodyControllerHandler<GenericName, GenericParams> {
	return bodyControllerHandlerKind.setTo(
		{
			name,
			create(params) {
				function tryToCreateReader(readerImplementation: BodyReaderImplementation) {
					if (bodyReaderImplementationKind.getValue(readerImplementation) !== name) {
						return E.fail();
					}
					return E.success(
						bodyReaderKind.setTo(
							{
								read: (request) => readerImplementation.read(request, params),
							} satisfies RemoveKind<BodyReader<GenericName>>,
							name,
						),
					);
				}
				return bodyControllerKind.setTo<
					RemoveKind<BodyController<GenericName, GenericParams>>,
					GenericName
				>(
					{
						name,
						params,
						tryToCreateReader,
						createReaderOrThrow(readerImplementation) {
							const result = tryToCreateReader(readerImplementation);

							if (E.isLeft(result)) {
								throw new WrongBodyReaderImplementationError(name, readerImplementation);
							}

							return unwrap(result);
						},
					},
					name,
				);
			},
			createReaderImplementation(read) {
				return bodyReaderImplementationKind.setTo(
					{ read },
					name,
				);
			},
			is(input) {
				return bodyControllerKind.has(input) && bodyControllerKind.getValue(input) === name;
			},
		} satisfies RemoveKind<BodyControllerHandler<GenericName, GenericParams>>,
	);
}
