import { createCoreLibKind } from '../../kind.mjs';
import { kindHeritage, E, unwrap } from '@duplojs/utils';

const bodyReaderKind = createCoreLibKind("body-reader");
const bodyReaderImplementationKind = createCoreLibKind("body-reader-implementation");
const bodyControllerKind = createCoreLibKind("body-controller");
const bodyControllerHandlerKind = createCoreLibKind("body-controller-handler");
class WrongBodyReaderImplementationError extends kindHeritage("wrong-body-reader-implementation", createCoreLibKind("wrong-body-reader-implementation"), Error) {
    controllerName;
    bodyReaderImplementation;
    constructor(controllerName, bodyReaderImplementation) {
        super({}, ["Received wrong body reader implementation."]);
        this.controllerName = controllerName;
        this.bodyReaderImplementation = bodyReaderImplementation;
    }
}
function createBodyController(name) {
    return bodyControllerHandlerKind.setTo({
        name,
        create(params) {
            function tryToCreateReader(readerImplementation) {
                if (bodyReaderImplementationKind.getValue(readerImplementation) !== name) {
                    return E.fail();
                }
                return E.success(bodyReaderKind.setTo({
                    read: (request) => readerImplementation.read(request, params),
                }, name));
            }
            return bodyControllerKind.setTo({
                name,
                params,
                tryToCreateReader,
                createReaderOrThrow(readerImplementation) {
                    const result = tryToCreateReader(readerImplementation);
                    if (E.isLeft(result)) {
                        throw new WrongBodyReaderImplementationError(name, readerImplementation);
                    }
                    return unwrap(result);
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

export { WrongBodyReaderImplementationError, createBodyController };
