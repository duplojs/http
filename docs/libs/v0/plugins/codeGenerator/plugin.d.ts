import { type HubPlugin } from "../../core/hub";
import { DP } from "@duplojs/utils";
export interface GenerateDataParserParams {
    outputFolder: string;
    disabledFromRoute?: boolean;
    dataParsers?: DP.DataParser[];
}
export interface CodeGeneratorPluginParams {
    outputFile: string;
    generateDataParser?: GenerateDataParserParams;
}
export declare function codeGeneratorPlugin(pluginParams: CodeGeneratorPluginParams): () => HubPlugin;
