import { createCoreLibKind } from '../kind.mjs';
import { kindHeritage } from '@duplojs/utils';

class BodySizeExceedsLimitError extends kindHeritage("body-size-exceeds-limit-error", createCoreLibKind("body-size-exceeds-limit-error"), Error) {
    bytesInString;
    constructor(bytesInString) {
        super({}, [`Body size is bigger than ${bytesInString}.`]);
        this.bytesInString = bytesInString;
    }
}

export { BodySizeExceedsLimitError };
