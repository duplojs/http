declare module "@duplojs/utils" {
    interface ReservedKindNamespace {
        DuplojsCookiePlugin: true;
    }
}
export declare const createCookiePluginKind: <GenericName extends string, GenericKindValue extends unknown = unknown>(name: GenericName & import("@duplojs/utils/string").ForbiddenString<GenericName, "@" | "/">) => import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<`@DuplojsCookiePlugin/${GenericName}`, GenericKindValue>>;
