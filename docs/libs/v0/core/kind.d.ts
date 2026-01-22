declare module "@duplojs/utils" {
    interface ReservedKindNamespace {
        DuplojsHttpCore: true;
    }
}
export declare const createCoreLibKind: <GenericName extends string, GenericKindValue extends unknown = unknown>(name: GenericName & import("@duplojs/utils/string").ForbiddenString<GenericName, "@" | "/">) => import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<`@DuplojsHttpCore/${GenericName}`, GenericKindValue>>;
