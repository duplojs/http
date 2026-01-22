declare module "@duplojs/utils" {
    interface ReservedKindNamespace {
        DuplojsHttpInterfacesNode: true;
    }
}
export declare const createInterfacesNodeLibKind: <GenericName extends string, GenericKindValue extends unknown = unknown>(name: GenericName & import("@duplojs/utils/string").ForbiddenString<GenericName, "@" | "/">) => import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<`@DuplojsHttpInterfacesNode/${GenericName}`, GenericKindValue>>;
