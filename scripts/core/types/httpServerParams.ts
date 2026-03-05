import { type MillisecondInString, type BytesInString } from "@duplojs/utils";
import { type Hosts } from "./hosts";

export interface HttpServerParams {
	readonly host: Hosts;
	readonly port: number;
	readonly maxBodySize: BytesInString | number;
	readonly informationHeaderKey: string;
	readonly predictedHeaderKey: string;
	readonly fromHookHeaderKey: string;
	readonly serverSentEventsDefaultIntervalPing: MillisecondInString | number;
	readonly uploadFolder: string;
}
