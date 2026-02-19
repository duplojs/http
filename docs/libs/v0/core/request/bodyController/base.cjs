'use strict';

var kind = require('../../kind.cjs');
var utils = require('@duplojs/utils');

const bodyReaderKind = kind.createCoreLibKind("body-reader");
const bodyReaderImplementationKind = kind.createCoreLibKind("body-reader-implementation");
const bodyControllerKind = kind.createCoreLibKind("body-controller");
const bodyControllerHandlerKind = kind.createCoreLibKind("body-controller-handler");
function createBodyController(name) {
    return bodyControllerHandlerKind.setTo({
        name,
        create(params) {
            return bodyControllerKind.setTo({
                name,
                params,
                tryToCreateReader(readerImplementation) {
                    if (bodyReaderImplementationKind.getValue(readerImplementation) !== name) {
                        return utils.E.fail();
                    }
                    return utils.E.success(bodyReaderKind.setTo({
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

exports.createBodyController = createBodyController;
