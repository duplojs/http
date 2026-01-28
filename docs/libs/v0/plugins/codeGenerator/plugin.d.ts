import { type HubPlugin } from "../../core/hub";
export interface CodeGeneratorPluginParams {
    outputFile: string;
}
export declare function codeGeneratorPlugin(pluginParams: CodeGeneratorPluginParams): () => HubPlugin;
