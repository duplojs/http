import { kindHeritage } from '@duplojs/utils';
import { createInterfacesNodeLibKind } from '../../kind.mjs';

class BodyParseFormDataError extends kindHeritage("body-parse-form-data-error", createInterfacesNodeLibKind("body-parse-form-data-error"), Error) {
    information;
    constructor(information) {
        super({}, [`Body parse form data error: ${information}`]);
        this.information = information;
    }
}

export { BodyParseFormDataError };
