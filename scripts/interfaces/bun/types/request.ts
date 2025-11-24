import "@core/request";
import "@core/steps";

export interface RawRequest {
	request: Request;
}

declare module "@core/steps" {
	interface DisabledExtractKeysCustom {
		raw: true;
	}
}

declare module "@core/request" {
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
