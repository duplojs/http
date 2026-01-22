import { kindHeritage } from '@duplojs/utils';
import { createInterfacesNodeLibKind } from '../kind.mjs';

class BodySizeExceedsLimitError extends kindHeritage("body-size-exceeds-limit-error", createInterfacesNodeLibKind("body-size-exceeds-limit-error"), Error) {
    bytesInString;
    constructor(bytesInString) {
        super({}, [`Body size is bigger than ${bytesInString}.`]);
        this.bytesInString = bytesInString;
    }
}

export { BodySizeExceedsLimitError };
