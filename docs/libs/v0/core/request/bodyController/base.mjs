import { createCoreLibKind } from '../../kind.mjs';
import { E } from '@duplojs/utils';

const bodyReaderKind = createCoreLibKind("body-reader");
const bodyReaderImplementationKind = createCoreLibKind("body-reader-implementation");
const bodyControllerKind = createCoreLibKind("body-controller");
const bodyControllerHandlerKind = createCoreLibKind("body-controller-handler");
function createBodyController(name) {
    return bodyControllerHandlerKind.setTo({
        name,
        create(params) {
            return bodyControllerKind.setTo({
                name,
                params,
                tryToCreateReader(readerImplementation) {
                    if (bodyReaderImplementationKind.getValue(readerImplementation) !== name) {
                        return E.fail();
                    }
                    return E.success(bodyReaderKind.setTo({
                        read: (request) => readerImplementation.read(request, params),
                    }, name));
                },
            }, name);
        },
        createReaderImplementation(read) {
            return bodyReaderImplementationKind.setTo({ read }, name);
        },
        is(input) {
            return bodyControllerKind.has(input) && bodyControllerKind.getValue(input) === name;
        },
    });
}

export { createBodyController };
