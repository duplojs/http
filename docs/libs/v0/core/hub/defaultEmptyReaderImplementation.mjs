import { E } from '@duplojs/utils';
import '../request/index.mjs';
import { EmptyBodyController } from '../request/bodyController/empty.mjs';

const defaultEmptyReaderImplementation = EmptyBodyController.createReaderImplementation(() => Promise.resolve(E.success(undefined)));

export { defaultEmptyReaderImplementation };
