import { type Request } from "../../request";
import { E, type Kind } from "@duplojs/utils";
export interface BodyControllerParams {
    bodyMaxSize?: number;
}
declare const bodyReaderKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/body-reader", string>>;
export interface BodyReader<GenericName extends string = string> extends Kind<typeof bodyReaderKind.definition, GenericName> {
    read(request: Request): Promise<E.Success | E.Error<Error>>;
}
declare const bodyReaderImplementationKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/body-reader-implementation", string>>;
export interface BodyReaderImplementation<GenericName extends string = string, GenericParams extends BodyControllerParams = BodyControllerParams> extends Kind<typeof bodyReaderImplementationKind.definition, GenericName> {
    read(request: Request, params: GenericParams): Promise<E.Success | E.Error<Error>>;
}
declare const bodyControllerKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/body-controller", string>>;
export interface BodyController<GenericName extends string = string, GenericParams extends BodyControllerParams = BodyControllerParams> extends Kind<typeof bodyControllerKind.definition, GenericName> {
    readonly name: GenericName;
    readonly params: GenericParams;
    tryToCreateReader(readerImplementation: BodyReaderImplementation): E.Success<BodyReader<GenericName>> | E.Fail;
    createReaderOrThrow(readerImplementation: BodyReaderImplementation): BodyReader<GenericName>;
}
declare const bodyControllerHandlerKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/body-controller-handler", unknown>>;
export interface BodyControllerHandler<GenericName extends string = string, GenericParams extends BodyControllerParams = BodyControllerParams> extends Kind<typeof bodyControllerHandlerKind.definition> {
    readonly name: GenericName;
    create(params: GenericParams): BodyController<GenericName, GenericParams>;
    createReaderImplementation(read: BodyReaderImplementation<GenericName, GenericParams>["read"]): BodyReaderImplementation<GenericName, GenericParams>;
    is(input: unknown): input is BodyController<GenericName, GenericParams>;
}
declare const WrongBodyReaderImplementationError_base: new (params: {
    "@DuplojsHttpCore/wrong-body-reader-implementation"?: unknown;
}, parentParams: readonly [message?: string | undefined, options?: ErrorOptions | undefined]) => Error & Kind<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/wrong-body-reader-implementation", unknown>, unknown> & Kind<import("@duplojs/utils").KindDefinition<"wrong-body-reader-implementation", unknown>, unknown>;
export declare class WrongBodyReaderImplementationError extends WrongBodyReaderImplementationError_base {
    controllerName: string;
    bodyReaderImplementation: BodyReaderImplementation;
    constructor(controllerName: string, bodyReaderImplementation: BodyReaderImplementation);
}
export declare function createBodyController<GenericName extends string, GenericParams extends BodyControllerParams>(name: GenericName): BodyControllerHandler<GenericName, GenericParams>;
export {};
