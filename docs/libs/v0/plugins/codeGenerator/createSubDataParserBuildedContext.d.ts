import { type DataParserToDataParser } from "@duplojs/data-parser-tools";
export interface SubBuildedContext extends DataParserToDataParser.BuildedContext {
    identifier: string;
}
export declare function createSubDataParserBuildedContext(buildedContext: DataParserToDataParser.BuildedContext): Generator<SubBuildedContext, unknown, unknown>;
