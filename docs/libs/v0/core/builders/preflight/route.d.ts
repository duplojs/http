import { type Floor } from "../../floor";
import { type RequestMethods, type Request } from "../../request";
import { type MakeRequestFromHooks, type HookRouteLifeCycle, type RoutePath } from "../../route";
import { type RouteBuilder } from "../route";
import { type NeverCoalescing } from "@duplojs/utils";
import { type Metadata } from "../../metadata";
declare module "./builder" {
    interface PreflightBuilder<GenericDefinition extends PreflightBuilderDefinition = PreflightBuilderDefinition, GenericFloor extends Floor = {}, GenericRequest extends Request = Request> {
        useRouteBuilder<GenericMethod extends RequestMethods, const GenericPaths extends RoutePath | readonly [RoutePath, ...RoutePath[]], const GenericHooks extends readonly HookRouteLifeCycle[] = readonly [], const GenericMetadata extends readonly Metadata[] = readonly []>(method: GenericMethod, path: GenericPaths, options?: {
            hooks?: GenericHooks | readonly HookRouteLifeCycle[];
            metadata?: GenericMetadata;
        }): RouteBuilder<{
            readonly method: GenericMethod;
            readonly paths: GenericPaths extends string ? readonly [GenericPaths] : GenericPaths;
            readonly preflightSteps: GenericDefinition["preflightSteps"];
            readonly steps: readonly [];
            readonly hooks: readonly [
                ...GenericDefinition["hooks"],
                ...GenericHooks
            ];
            readonly metadata: readonly [
                ...GenericDefinition["metadata"],
                ...GenericMetadata
            ];
        }, GenericFloor, (GenericRequest & NeverCoalescing<MakeRequestFromHooks<GenericHooks>, Request>)>;
    }
}
