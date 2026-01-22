import { createKindNamespace } from '@duplojs/utils';

const createInterfacesBunLibKind = createKindNamespace(
// @ts-expect-error reserved kind namespace
"DuplojsHttpInterfacesBun");

export { createInterfacesBunLibKind };
