import { type AnyFunction } from "@duplojs/utils";

interface User {
	username: string;
	id: number;
}

export declare const findOneUser: AnyFunction<[id: number], Promise<User | null>>;
