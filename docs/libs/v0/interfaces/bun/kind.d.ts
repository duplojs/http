declare module "@duplojs/utils" {
    interface ReservedKindNamespace {
        DuplojsHttpInterfacesBun: true;
    }
}
export declare const createInterfacesBunLibKind: <GenericName extends string, GenericKindValue extends unknown = unknown>(name: GenericName & import("@duplojs/utils/string").ForbiddenString<GenericName, "@" | "/">) => import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<`@DuplojsHttpInterfacesBun/${GenericName}`, GenericKindValue>>;
