import "@core/request";
import type http from "http";

export interface RawRequest {
	request: http.IncomingMessage;
	response: http.ServerResponse;
}

declare module "@core/request" {
	interface DisabledExtractKeysCustom {
		raw: true;
	}

	interface RequestInitializationData {
		raw: RawRequest;
	}

	interface Request {

		/**
		 * @deprecated
		 */
		raw: RawRequest;
	}
}
