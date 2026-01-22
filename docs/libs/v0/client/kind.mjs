import { createKindNamespace } from '@duplojs/utils';

const createClientKind = createKindNamespace(
// @ts-expect-error reserved kind namespace
"DuplojsHttpClient");

export { createClientKind };
