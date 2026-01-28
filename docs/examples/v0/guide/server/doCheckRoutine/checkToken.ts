import { type AnyFunction, type E } from "@duplojs/utils";

export declare const checkToken: AnyFunction<[token: string], E.Success<{ userId: number }> | E.Fail>;
