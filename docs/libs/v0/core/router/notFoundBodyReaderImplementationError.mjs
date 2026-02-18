import { createCoreLibKind } from '../kind.mjs';
import { kindHeritage } from '@duplojs/utils';

class NotFoundBodyReaderImplementationError extends kindHeritage("not-found-body-reader-implementation-error", createCoreLibKind("not-found-body-reader-implementation-error"), Error) {
    route;
    bodyController;
    constructor(route, bodyController) {
        super({}, ["Body reader implementation not found."]);
        this.route = route;
        this.bodyController = bodyController;
    }
}

export { NotFoundBodyReaderImplementationError };
