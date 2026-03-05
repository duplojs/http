export const regexUrlAnalyser = /^(?<path>[^?]*)(?:\?(?<query>[^#]*))?(?:#(?<fragment>[^]*))?$/;
export const regexQueryAnalyser = /(?<key>[^=&]+)=(?<value>[^&]*)/g;
const invalidEntryRegex = /__proto__|constructor|prototype/;

export interface DecodedUrl {
	path: string;
	query: Record<string, string | string[]>;
}

export function decodeUrl(url: string): DecodedUrl {
	try {
		const groups = regexUrlAnalyser.exec(url)!.groups!;

		const path = decodeURIComponent(groups.path || "/");
		const queryString = groups.query;

		if (!queryString) {
			return {
				path,
				query: {},
			};
		}

		const query: DecodedUrl["query"] = {};

		for (const result of queryString.matchAll(regexQueryAnalyser)) {
			const groups = result.groups as Record<"key" | "value", string>;

			const key = decodeURIComponent(groups.key);

			if (invalidEntryRegex.test(key)) {
				continue;
			}

			const value = decodeURIComponent(groups.value);

			const currentValue = query[key];

			if (typeof currentValue === "undefined") {
				query[key] = value;
			} else if (currentValue instanceof Array) {
				currentValue.push(value);
			} else {
				query[key] = [currentValue, value];
			}
		}

		return {
			path,
			query,
		};
	} catch {
		return {
			path: "/",
			query: {},
		};
	}
}
