import { createCoreLibKind } from '../kind.mjs';
import { kindHeritage } from '@duplojs/utils';

class RouterBuildError extends kindHeritage("router-build-error", createCoreLibKind("router-build-error"), Error) {
    route;
    element;
    constructor(route, element) {
        super({}, ["Error during build route."]);
        this.route = route;
        this.element = element;
    }
}

export { RouterBuildError };
