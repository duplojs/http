'use strict';

var kind = require('../../kind.cjs');
var utils = require('@duplojs/utils');

const bodyReaderKind = kind.createCoreLibKind("body-reader");
const bodyReaderImplementationKind = kind.createCoreLibKind("body-reader-implementation");
const bodyControllerKind = kind.createCoreLibKind("body-controller");
const bodyControllerHandlerKind = kind.createCoreLibKind("body-controller-handler");
class WrongBodyReaderImplementationError extends utils.kindHeritage("wrong-body-reader-implementation", kind.createCoreLibKind("wrong-body-reader-implementation"), Error) {
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
                    return utils.E.fail();
                }
                return utils.E.success(bodyReaderKind.setTo({
                    read: (request) => readerImplementation.read(request, params),
                }, name));
            }
            return bodyControllerKind.setTo({
                name,
                params,
                tryToCreateReader,
                createReaderOrThrow(readerImplementation) {
                    const result = tryToCreateReader(readerImplementation);
                    if (utils.E.isLeft(result)) {
                        throw new WrongBodyReaderImplementationError(name, readerImplementation);
                    }
                    return utils.unwrap(result);
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

exports.WrongBodyReaderImplementationError = WrongBodyReaderImplementationError;
exports.createBodyController = createBodyController;
