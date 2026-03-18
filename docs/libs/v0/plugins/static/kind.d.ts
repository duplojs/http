declare module "@duplojs/utils" {
    interface ReservedKindNamespace {
        DuplojsStaticPlugin: true;
    }
}
export declare const createStaticPluginKind: <GenericName extends string, GenericKindValue extends unknown = unknown>(name: GenericName & import("@duplojs/utils/string").ForbiddenString<GenericName, "@" | "/">) => import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<`@DuplojsStaticPlugin/${GenericName}`, GenericKindValue>>;
