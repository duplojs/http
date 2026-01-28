import { createKindNamespace } from '@duplojs/utils';

const createInterfacesDenoLibKind = createKindNamespace(
// @ts-expect-error reserved kind namespace
"DuplojsHttpInterfacesDeno");

export { createInterfacesDenoLibKind };
