export declare const regexUrlAnalyser: RegExp;
export declare const regexQueryAnalyser: RegExp;
export interface DecodedUrl {
    path: string;
    query: Record<string, string | string[]>;
}
export declare function decodeUrl(url: string): DecodedUrl;
