import { createBodyController } from './base.mjs';

const EmptyBodyController = createBodyController("empty");
function controlBodyAsEmpty() {
    return EmptyBodyController.create({});
}

export { EmptyBodyController, controlBodyAsEmpty };
