import type { SerializerParams } from "./serialize";
declare module "../../core/request" {
    interface Request {
        cookies?: Partial<Record<string, string>>;
    }
}
declare module "../../core/response" {
    interface Response<GenericCode, GenericInformation, GenericBody> {
        cookie?: Record<string, {
            value: string;
            params?: SerializerParams;
        }>;
        setCookie(name: string, value: string, params?: SerializerParams): this;
        dropCookie(name: string): this;
    }
}
