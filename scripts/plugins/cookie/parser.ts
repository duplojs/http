/**
 * @internal
 */
export function findPairEndIndex(value: string, start: number, len: number) {
	const index = value.indexOf(";", start);
	return index === -1 ? len : index;
}

/**
 * @internal
 */
export function sliceAndTrimOws(value: string, min: number, max: number) {
	if (min === max) {
		return "";
	}
	let start = min;
	let end = max;

	do {
		const code = value.charCodeAt(start);
		if (code !== 32 /*   */ && code !== 9 /* \t */) {
			break;
		}
	} while (++start < end);

	while (end > start) {
		const code = value.charCodeAt(end - 1);
		if (code !== 32 /*   */ && code !== 9 /* \t */) {
			break;
		}
		end--;
	}

	return value.slice(start, end);
}

/**
 * @internal
 */
export function decode(value: string): string {
	if (!value.includes("%")) {
		return value;
	}

	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}

export function defaultParser(value: string): Partial<Record<string, string>> {
	const result: Partial<Record<string, string>> = {};
	const valueLength = value.length;

	if (valueLength < 2) {
		return result;
	}

	let index = 0;

	do {
		const equalCharIndex = value.indexOf("=", index);

		if (equalCharIndex === -1) {
			break;
		}

		const pairEndIndex = findPairEndIndex(value, index, valueLength);

		if (equalCharIndex > pairEndIndex) {
			index = value.lastIndexOf(";", equalCharIndex - 1) + 1;
			continue;
		}

		const key = sliceAndTrimOws(value, index, equalCharIndex);

		if (
			key === ""
			|| key === "__proto__"
			|| key === "constructor"
			|| key === "prototype"
		) {
			index = pairEndIndex + 1;
			continue;
		}

		if (result[key] === undefined) {
			result[key] = decode(sliceAndTrimOws(value, equalCharIndex + 1, pairEndIndex));
		}

		index = pairEndIndex + 1;
	} while (index < valueLength);

	return result;
}

export type Parser = typeof defaultParser;
