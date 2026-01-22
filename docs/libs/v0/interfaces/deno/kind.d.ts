declare module "@duplojs/utils" {
    interface ReservedKindNamespace {
        DuplojsHttpInterfacesDeno: true;
    }
}
export declare const createInterfacesDenoLibKind: <GenericName extends string, GenericKindValue extends unknown = unknown>(name: GenericName & import("@duplojs/utils/string").ForbiddenString<GenericName, "@" | "/">) => import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<`@DuplojsHttpInterfacesDeno/${GenericName}`, GenericKindValue>>;
