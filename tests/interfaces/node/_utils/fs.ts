import type * as fileSystem from "fs";
import type * as fileSystemPromise from "fs/promises";
import type { Mock } from "vitest";

const original = Symbol("original");

vi.mock(
	"fs",
	async(importOriginal) => {
		const fs = await importOriginal() as object;

		return Object.fromEntries([
			...Object
				.keys(fs)
				.map((key) => [key, vi.fn()]),
			[original, fs],
		]);
	},
);

vi.mock(
	"fs/promises",
	async(importOriginal) => {
		const fsPromise = await importOriginal() as object;

		return Object.fromEntries([
			...Object
				.keys(fsPromise)
				.map((key) => [key, vi.fn()]),
			[original, fsPromise],
		]);
	},
);

export const fsSpy: Record<keyof typeof fileSystem, Mock> = await import("fs") as any;
export const fspSpy: Record<keyof typeof fileSystemPromise, Mock> = await import("fs/promises") as any;
export function fsSpyResetMock() {
	Object.values(fsSpy).forEach((value) => {
		value.mockReset();
	});
}

export function fspSpyResetMock() {
	Object.values(fspSpy).forEach((value) => {
		value.mockReset();
	});
}

export const fs: typeof fileSystem = (fsSpy as never)[original as never] as any;
export const fsp: typeof fileSystemPromise = (fspSpy as never)[original as never] as any;
