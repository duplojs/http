import { ResponseContract } from "../response";
export declare const defaultExtractContract: NoInfer<ResponseContract.Contract<"422", "extract-error", import("@duplojs/utils/dataParser").DataParserEmpty<{
    readonly errorMessage?: string | undefined;
    readonly coerce: boolean;
    readonly checkers: readonly [];
}>>>;
