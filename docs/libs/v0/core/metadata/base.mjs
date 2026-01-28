import { createCoreLibKind } from '../kind.mjs';
import { wrapValue } from '@duplojs/utils';

const metadataKind = createCoreLibKind("metadata");
function createMetadata(name) {
    function metadataHandler(value) {
        return metadataKind.setTo(wrapValue(value), name);
    }
    metadataHandler.dataName = name;
    metadataHandler.is = function (input) {
        return metadataKind.has(input)
            && metadataKind.getValue(input) === name;
    };
    return metadataHandler;
}

export { createMetadata, metadataKind };
