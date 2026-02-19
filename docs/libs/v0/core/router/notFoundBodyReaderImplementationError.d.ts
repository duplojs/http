import { type BodyController } from "../request";
import { type Route } from "../route";
declare const NotFoundBodyReaderImplementationError_base: new (params: {
    "@DuplojsHttpCore/not-found-body-reader-implementation-error"?: unknown;
}, parentParams: readonly [message?: string | undefined, options?: ErrorOptions | undefined]) => Error & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/not-found-body-reader-implementation-error", unknown>, unknown> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"not-found-body-reader-implementation-error", unknown>, unknown>;
export declare class NotFoundBodyReaderImplementationError extends NotFoundBodyReaderImplementationError_base {
    route: Route;
    bodyController: BodyController;
    constructor(route: Route, bodyController: BodyController);
}
export {};
