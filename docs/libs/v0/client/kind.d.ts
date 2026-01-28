declare module "@duplojs/utils" {
    interface ReservedKindNamespace {
        DuplojsHttpClient: true;
    }
}
export declare const createClientKind: <GenericName extends string, GenericKindValue extends unknown = unknown>(name: GenericName & import("@duplojs/utils/string").ForbiddenString<GenericName, "@" | "/">) => import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<`@DuplojsHttpClient/${GenericName}`, GenericKindValue>>;
